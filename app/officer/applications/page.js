'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [registerid, setregisterid] = useState('');
  const [formData, setFormData] = useState({
    service: '',
    doneDate: '',
    status: '',
    registerid: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/verify-token");
      if (!res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setregisterid(data.user.id); // Set registerid
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!registerid) return; // Ensure registerid is available before fetching applications

    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/auth/get-applications?id=${registerid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
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
  }, [registerid]); // Depend on registerid

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        setIsModalOpen(false); // Close modal
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Applications</h1>

      {applications.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No applications available.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Service</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Done Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {applications.map((application) => (
                <tr key={application._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{application.service}</td>
                  <td className="px-6 py-3">{new Date(application.doneDate).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{application.status}</td>
                  <td className="px-6 py-3">
                    <button
                      className="bg-blue-500 text-white py-1 px-4 rounded transition-transform hover:scale-105"
                      onClick={() => {
                        setSelectedApplication(application);
                        setFormData({
                          service: application.service,
                          doneDate: application.doneDate,
                          status: application.status,
                          registerid: application.registerid,
                        });
                        setIsModalOpen(true); // Open the modal
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for editing the application */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-center mb-4">Edit Application</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service</label>
                <input
                  type="text"
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="doneDate" className="block text-sm font-medium text-gray-700">Done Date</label>
                <input
                  type="date"
                  id="doneDate"
                  name="doneDate"
                  value={formData.doneDate}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 py-2 px-4 rounded"
                  onClick={() => setIsModalOpen(false)} // Close modal
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                  Update
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
