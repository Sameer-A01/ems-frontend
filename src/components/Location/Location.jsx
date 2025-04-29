import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const LocationTracking = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/location", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        let sno = 1;
        const data = res.data.locations.map((loc) => ({
          sno: sno++,
          name: loc.employeeId?.userId?.name || "N/A",
          employeeId: loc.employeeId?.employeeId || "N/A",
          department: loc.employeeId?.department?.dep_name || "N/A",
          lat: loc.lat,
          lon: loc.lon,
          timestamp: new Date(loc.timestamp).toLocaleString(),
          photo: loc.photoUrl ? (
            <a href={loc.photoUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={loc.photoUrl}
                alt="Selfie"
                className="w-10 h-10 object-cover rounded-full border"
              />
            </a>
          ) : (
            "N/A"
          ),
          device: loc.deviceInfo?.platform || "Unknown",
          ipAddress: loc.ipAddress || "N/A",
          isVerified: loc.isVerified ? "✅ Verified" : "❌ Unverified",
          map: (
            <a
              href={`https://www.google.com/maps?q=${loc.lat},${loc.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Map
            </a>
          ),
          remarks: loc.remarks || "—"
        }));

        setLocations(data);
        setFilteredLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm) ||
      loc.employeeId.toLowerCase().includes(searchTerm) ||
      loc.department.toLowerCase().includes(searchTerm)
    );
    setFilteredLocations(filtered);
  };

  const columns = [
    { name: "S.No", selector: (row) => row.sno, width: "60px" },
    { name: "Name", selector: (row) => row.name },
    { name: "Emp ID", selector: (row) => row.employeeId },
    { name: "Department", selector: (row) => row.department },
    { name: "Lat", selector: (row) => row.lat },
    { name: "Lon", selector: (row) => row.lon },
    { name: "Check-in Time", selector: (row) => row.timestamp },
    { name: "Photo", selector: (row) => row.photo },
    { name: "Device", selector: (row) => row.device },
    { name: "IP", selector: (row) => row.ipAddress },
    { name: "Status", selector: (row) => row.isVerified },
    { name: "Map", selector: (row) => row.map },
    { name: "Remarks", selector: (row) => row.remarks }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Staff Location Tracking</h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or department"
          className="px-4 py-1 border"
          onChange={handleFilter}
        />
        <Link
     to="/admin-dashboard/employee-location"
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          Location Report
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={filteredLocations}
        pagination
        responsive
      />
    </div>
  );
};

export default LocationTracking;
