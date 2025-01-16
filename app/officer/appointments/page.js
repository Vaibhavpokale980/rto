'use client';

import { useState, useEffect } from 'react';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [appointments1, setAppointments1] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch both sets of appointments
    useEffect(() => {
        const fetchAllAppointments = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch('/api/auth/get-appointments'),
                    fetch('/api/auth/get-appointments2'),
                ]);

                const data1 = await response1.json();
                const data2 = await response2.json();

                if (data1.success) {
                    setAppointments(data1.data);
                } else {
                    setError(data1.message);
                }

                if (data2.success) {
                    setAppointments1(data2.data);
                } else {
                    setError(data2.message);
                }
            } catch (error) {
                setError('Failed to fetch appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAllAppointments();
    }, []);

    // Sort the appointments with approved first, then by date
    const sortAppointments = (appointmentsList) =>
        [...appointmentsList].sort((a, b) => {
            // Sort by approval status first
            if (a.approved !== b.approved) {
                return a.approved ? -1 : 1;
            }
            // If approval status is the same, sort by date
            return new Date(a.date) - new Date(b.date); // Ascending order by date
        });

    const handleApproval = async (id, status) => {
        try {
            const res = await fetch(`/api/auth/update-appointment/approve?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: status }),
            });

            if (res.ok) {
                setAppointments((prev) => sortAppointments(
                    prev.map((appointment) =>
                        appointment._id === id ? { ...appointment, approved: status } : appointment
                    )
                ));
                setAppointments1((prev) => sortAppointments(
                    prev.map((appointment) =>
                        appointment._id === id ? { ...appointment, approved: status } : appointment
                    )
                ));
            } else {
                alert('Failed to update approval status');
            }
        } catch (error) {
            alert('An error occurred while updating approval status');
        }
    };

    const handleDone = async (id, status) => {
        try {
            const res = await fetch(`/api/auth/update-appointment/done?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: status }),
            });

            if (res.ok) {
                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment._id === id ? { ...appointment, done: status } : appointment
                    )
                );
                setAppointments1((prev) =>
                    prev.map((appointment) =>
                        appointment._id === id ? { ...appointment, done: status } : appointment
                    )
                );
            } else {
                alert('Failed to update done status');
            }
        } catch (error) {
            alert('An error occurred while updating done status');
        }
    };

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

    // Combine and sort appointments for rendering
    const sortedAppointments = sortAppointments([...appointments, ...appointments1]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="mx-auto p-6 w-full max-w-6xl bg-gray-800 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-100">All Booked Appointments</h1>
                {sortedAppointments.length === 0 ? (
                    <div className="text-center text-white py-4">No appointments available.</div>
                ) : (
                    <table className="min-w-full table-auto text-gray-100 border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="py-2 px-4 text-left">Service</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Register ID</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Approved</th>
                                <th className="py-2 px-4 text-left">Done</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAppointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-700">
                                    <td className="py-2 px-4">{appointment.option}</td>
                                    <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{appointment._id}</td>
                                    <td className="py-2 px-4">{appointment.name}</td>
                                    <td className="py-2 px-4">{appointment.role}</td>
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
                                    <td className="py-2 px-4 flex space-x-2">
                                        {appointment.approved ? (
                                            <button
                                                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                                                onClick={() => handleApproval(appointment._id, false)}
                                            >
                                                Reject
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                                                onClick={() => handleApproval(appointment._id, true)}
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {appointment.done ? (
                                            <button
                                                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                                                onClick={() => handleDone(appointment._id, false)}
                                            >
                                                Mark Not Done
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                                                onClick={() => handleDone(appointment._id, true)}
                                            >
                                                Mark Done
                                            </button>
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
