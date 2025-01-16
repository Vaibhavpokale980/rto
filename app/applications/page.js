'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import

const ApplicationsPage = () => {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [id, setregisterid] = useState(''); // Initializing registerid as an empty string

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/auth/verify-token");
            if (!res.ok) {
                router.push("/login");
            }
            else {
                let data = await res.json();
                setregisterid(data.user.id); // Set registerid after successful response
                console.log(data.user.id, "User ID fetched"); // Debug log for fetched user id
            }
        };

        checkAuth();
    }, [router]);

    // Fetch all applications when the component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            if (!id) return; // Ensure id is set before making the fetch request
            try {
                const response = await fetch(`/api/auth/get-applications?id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await response.json();

                // Log the data to ensure it's an array
                console.log("Fetched data:", data);

                // Check if data is an array and update the state
                if (Array.isArray(data)) {
                    setApplications(data);
                } else {
                    setError('Unexpected data format');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [id]); // Add `id` as dependency to trigger fetch when it changes

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 font-bold">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Applications</h1>

            {applications.length === 0 ? (
                <p className="text-center text-xl text-gray-600">No applications found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="border px-6 py-4 text-left">Service</th>
                                <th className="border px-6 py-4 text-left">Done Date</th>
                                <th className="border px-6 py-4 text-left">Status</th>
                                <th className="border px-6 py-4 text-left">Register ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id} className="hover:bg-gray-100">
                                    <td className="border px-6 py-3">{application.service}</td>
                                    <td className="border px-6 py-3">{new Date(application.doneDate).toLocaleDateString()}</td>
                                    <td className="border px-6 py-3">{application.status}</td>
                                    <td className="border px-6 py-3">{application.registerid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;
