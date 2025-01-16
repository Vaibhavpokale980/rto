'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentBooking() {
    const router = useRouter();
    const [registerid, setregisterid] = useState(''); // Initializing registerid as an empty string
    const [role,setrole]=useState("citizen")
    const [namer,setnamer]=useState("user");

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/auth/verify-token");
            if (!res.ok) {
                router.push("/login");
            }
            else {
                let data = await res.json();
                setregisterid(data.user.id); // Set registerid after successful response
                console.log(data.user.id, "User ID fetched",data.rolex); // Debug log for fetched user id
                setrole(data.rolex)
                setnamer(data.namex)
            }
        };

        checkAuth();
    }, [router]);

    const [formData, setFormData] = useState({
        option: '',
        date: '',
        registerid: '',
        city: '',
    });

    const [minDate, setMinDate] = useState('');
    const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Kolhapur"];

    useEffect(() => {
        // Get today's date
        const today = new Date();

        // Format date as YYYY-MM-DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        setMinDate(formatDate(today)); // Set minimum date for the date picker
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update formData when fields change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Before submitting the form, ensure that registerid is in the form data
        const updatedFormData = { ...formData, registerid: registerid,roler:role,name:namer };
        // console.log("tttttttttttttttttt",role);

        console.log('Appointment Details:', updatedFormData); // Log the updated form data
        
        const res = await fetch("/api/auth/book-appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
        });

        if (!res) alert("something went wrong");
        else alert('Appointment booked successfully!');
    };

    return (
        <div className='min-h-screen bg-slate-900 flex w-full h-full items-center'>
            <div className="mx-auto p-6 h-full w-[30%]  bg-gray-200 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4 flex justify-center pb-12 text-gray-800">Book an Appointment</h1>
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Service Option Dropdown */}
                    <div>
                        <label htmlFor="option" className="block text-sm font-medium text-gray-700">
                            Select Service
                        </label>
                        <select
                            id="option"
                            name="option"
                            value={formData.option}
                            onChange={handleChange}
                            className="mt-1 block h-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled>Choose an option</option>
                            <option value="license">License</option>
                            <option value="vehicle_registration">Vehicle Registration</option>
                            <option value="road_tax_payment">Road Tax Payment</option>
                            <option value="number_plate">Number Plate</option>
                        </select>
                    </div>

                    {/* City Selector */}
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            Select City
                        </label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block h-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled>Choose a city</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Select Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={minDate}
                            className="mt-1 h-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}
