const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createPool({
  host: 'bn7x29xpitprnmmgoykt-mysql.services.clever-cloud.com',
  user: 'u8fuoriqng1zs0ds',
  password: 'es6ZevuOjxjCuJfVe4eY',
  database: 'bn7x29xpitprnmmgoykt',
  port: 3306,
  connectionLimit: 10
});

// No need for db.connect() with a connection pool

// Helper function for server-side validation
const validateEmployeeData = (data) => {
  const { firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role } = data;
  if (!firstName || !lastName || !employeeID || !email || !phoneNumber || !department || !dateOfJoining || !role) {
    return 'All fields are required';
  }
  if (!/^\d{10}$/.test(phoneNumber)) {
    return 'Invalid phone number';
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Invalid email address';
  }
  if (new Date(dateOfJoining) > new Date()) {
    return 'Future dates not allowed';
  }
  return null; // No errors
};

// API Endpoint to Add Employee
app.post('/api/employees', (req, res) => {
  const employeeData = req.body;

  // Validate data
  const validationError = validateEmployeeData(employeeData);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role } = employeeData;

  const checkQuery = `SELECT * FROM employees WHERE email = ? OR employeeID = ?`;
  
  db.query(checkQuery, [email, employeeID], (err, results) => {
    console.log('Executing duplicate check query:', checkQuery);
    console.log('Query parameters:', { email, employeeID });
  
    if (err) {
      console.error('Database error during duplicate check:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  
    console.log('Duplicate check results:', results);
  
    if (results.length > 0) {
      const duplicateField = results[0].email === email ? 'Email ID' : 'Employee ID';
      return res.status(400).json({ error: `${duplicateField} already exists` });
    }
    // Insert new employee
    const insertQuery =
      'INSERT INTO employees(firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role], (err) => {
      if (err) {
        console.error('Database error during insertion:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ success: 'Employee added successfully' });
    });
  });
});

// API Endpoint to Get All Employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }
    
    res.status(200).json({ employees: results });
  });
});

// API Endpoint to Update Employee
app.put('/api/employees/:employeeId', (req, res) => {
  const empId = req.params.employeeId;
  const updatedData = req.body;

  let query = 'UPDATE employees SET ';
  const updates = [];
  const values = [];

  for (const key in updatedData) {
    if (updatedData[key]) {
      updates.push(`${key} = ?`);
      values.push(updatedData[key]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).send({ message: 'No valid fields to update' });
  }

  query += updates.join(', ') + ' WHERE employeeID = ?';
  values.push(empId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('SQL Update Error:', err);
      return res.status(500).send({ message: 'Failed to update employee', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Employee not found' });
    }

    res.status(200).send({ message: 'Employee updated successfully' });
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
