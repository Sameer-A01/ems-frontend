import React, { useState } from 'react';
import axios from 'axios';

const StaffLocationCheckin = () => {
    const [message, setMessage] = useState('');
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [photo, setPhoto] = useState(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setMessage('');
        setLocation(null);

        const formData = new FormData();
        formData.append('photo', file);

        // Device info
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: {
                width: screen.width,
                height: screen.height,
            },
        };
        formData.append('deviceInfo', JSON.stringify(deviceInfo));

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No authentication token found');
            }

            const res = await axios.post('http://localhost:5000/api/location/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (res.data.success) {
                setLocation(res.data.location);
                setMessage('✅ Check-in successful!');
            } else {
                setMessage(`❌ ${res.data.message}`);
            }
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setMessage('❌ Error uploading. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-xl shadow-md mt-10 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-center">📍 Staff Location Check-In</h2>

            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleUpload}
                className="mb-4 block w-full"
            />

            {isLoading && <p className="text-blue-500">⏳ Uploading...</p>}
            {message && <p className="text-center mt-2 font-medium">{message}</p>}

            {location && (
                <div className="mt-4 text-center">
                    <p><strong>Latitude:</strong> {location.lat}</p>
                    <p><strong>Longitude:</strong> {location.lon}</p>
                    <a
                        href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mt-2 inline-block"
                    >
                        🌍 View on Google Maps
                    </a>
                </div>
            )}
        </div>
    );
};

export default StaffLocationCheckin;
