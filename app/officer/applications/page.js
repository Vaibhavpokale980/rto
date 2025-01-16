'use client';
import React, { useState, useEffect } from 'react';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    service: '',
    doneDate: '',
    status: '',
    registerid: '',
  });

  // Fetch all applications when the component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/auth/get-applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Format the date to 'YYYY-MM-DD' when editing an application
  const formatDate = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = (`0${newDate.getMonth() + 1}`).slice(-2); // Add leading zero if needed
    const day = (`0${newDate.getDate()}`).slice(-2); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  // Handle the form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to update the application details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/update-application/${selectedApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Application updated successfully!');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApplication._id ? { ...app, ...formData } : app
          )
        );
        setSelectedApplication(null);
        setFormData({
          service: '',
          doneDate: '',
          status: '',
          registerid: '',
        });
      } else {
        alert(result.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Something went wrong!');
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Applications</h1>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <p className="text-center text-lg">No applications found.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-6 py-3">Service</th>
              <th className="border px-6 py-3">Done Date</th>
              <th className="border px-6 py-3">Status</th>
              <th className="border px-6 py-3">Register ID</th>
              <th className="border px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr
                key={application._id}
                className="border-b hover:bg-gray-100 transition duration-200"
              >
                <td className="border px-6 py-3">{application.service}</td>
                <td className="border px-6 py-3">
                  {new Date(application.doneDate).toLocaleDateString()}
                </td>
                <td className="border px-6 py-3">{application.status}</td>
                <td className="border px-6 py-3">{application.registerid}</td>
                <td className="border px-6 py-3">
                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setFormData({
                        service: application.service,
                        doneDate: formatDate(application.doneDate), // Format date for the form
                        status: application.status,
                        registerid: application.registerid,
                      });
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Application Form Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Edit Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="service" className="block text-lg font-medium">
                  Service
                </label>
                <input
                  type="text"
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="doneDate" className="block text-lg font-medium">
                  Done Date
                </label>
                <input
                  type="date"
                  id="doneDate"
                  name="doneDate"
                  value={formData.doneDate}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-lg font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-md w-full"
                >
                  <option value="Under A">Under A</option>
                  <option value="Under B">Under B</option>
                  <option value="Under C">Under C</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="registerid" className="block text-lg font-medium">
                  Register ID
                </label>
                <input
                  type="text"
                  id="registerid"
                  name="registerid"
                  value={formData.registerid}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded-md w-full"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
