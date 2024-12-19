import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function EmployeeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      console.log("Form Data Submitted:", data); // Logging form data for debugging

      // Sending data to the backend
      const response = await axios.post('https://employee-form-deploy.onrender.com/api/employees', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setResponseMessage(response.data.success);
        setIsError(false);
      } else if (response.data.error) {
        setResponseMessage(response.data.error);
        setIsError(true);
      } else {
        setResponseMessage('Unexpected response from server');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred while adding the employee.';
      setResponseMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-4">Add Employee</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              {...register('firstName', { required: true })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstName && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              {...register('lastName', { required: true })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="employeeID" className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              id="employeeID"
              {...register('employeeID', { required: true, maxLength: 10 })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.employeeID && (
              <span className="text-red-500 text-sm">
                {errors.employeeID.type === 'maxLength' ? 'Max 10 characters' : 'This field is required'}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && <span className="text-red-500 text-sm">Invalid email address</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              {...register('phoneNumber', { required: true, pattern: /^\d{10}$/ })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phoneNumber && <span className="text-red-500 text-sm">Invalid phone number</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              id="department"
              {...register('department', { required: true })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </select>
            {errors.department && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700">Date of Joining</label>
            <input
              type="date"
              id="dateOfJoining"
              {...register('dateOfJoining', { required: true, validate: value => new Date(value) <= new Date() })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.dateOfJoining && <span className="text-red-500 text-sm">Future dates not allowed</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              id="role"
              {...register('role', { required: true })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.role && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              type="reset"
              className="px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </form>

        {responseMessage && (
          <div
            className={`mt-4 p-4 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeForm;
