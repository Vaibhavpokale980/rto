'use client';

import { useState, useEffect } from 'react';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch appointments when the component mounts
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/auth/get-appointmenter');
                const data = await response.json();

                if (data.success) {
                    setAppointments(data.data); // Set the appointments data
                } else {
                    setError(data.message); // Handle any errors
                }
            } catch (error) {
                setError('Failed to fetch appointments'); // Handle network or fetch error
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchAppointments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="text-center">
                    <div className="animate-spin border-t-4 border-b-4 border-blue-500 w-16 h-16 rounded-full mx-auto"></div>
                    <p className="text-white mt-4">Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="mx-auto p-6 w-full max-w-4xl bg-gray-800 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-100">All Booked Appointments</h1>

                {appointments.length === 0 ? (
                    <div className="text-center text-white py-4">No appointments available.</div>
                ) : (
                    <table className="min-w-full table-auto text-gray-100 border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="py-2 px-4 text-left">Service</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Register ID</th>
                                <th className="py-2 px-4 text-left">Approved</th>
                                <th className="py-2 px-4 text-left">Done</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-700">
                                    <td className="py-2 px-4">{appointment.option}</td>
                                    <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{appointment.registerid}</td>
                                    <td className="py-2 px-4">
                                        {appointment.approved ? (
                                            <span className="text-green-400">Approved</span>
                                        ) : (
                                            <span className="text-red-400">Not Approved</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {appointment.done ? (
                                            <span className="text-green-400">Done</span>
                                        ) : (
                                            <span className="text-red-400">Not Done</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
