"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";

export default function DeviceDetailsPage({ params }: { params: { IMEI: string } }) {
  const { IMEI } = useParams(); // Extract IMEI from the URL
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPlateNumber, setEditingPlateNumber] = useState(""); // Editable PlateNumber
  const [saving, setSaving] = useState(false); // Save state

  // Fetch device details
  useEffect(() => {
    const fetchDeviceDetails = async () => {
      const { data, error } = await supabase
        .from("trackers")
        .select("*")
        .eq("IMEI", IMEI) // Query by IMEI
        .single(); // Fetch a single device

      if (error) {
        console.error("Error fetching device details:", error.message);
      } else {
        setDevice(data);
        setEditingPlateNumber(data.PlateNumber); // Initialize editable PlateNumber
      }

      setLoading(false);
    };

    fetchDeviceDetails();
  }, [IMEI]);

  // Save the updated PlateNumber to the database
  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("trackers")
      .update({ PlateNumber: editingPlateNumber }) // Update the PlateNumber
      .eq("IMEI", IMEI); // Match the specific device by IMEI

    setSaving(false);

    if (error) {
      console.error("Error saving Plate Number:", error.message);
      alert("Failed to save changes. Please try again.");
    } else {
      alert("Plate Number updated successfully!");
      setDevice((prevDevice) => ({
        ...prevDevice,
        PlateNumber: editingPlateNumber,
      })); // Update the local state
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!device) {
    return <p>Device not found.</p>;
  }

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Device Details</h1>
      <p>
        <strong>IMEI:</strong> {device.IMEI}
      </p>
      <div className="mb-4">
        <label className="block font-medium mb-2">Plate Number:</label>
        <input
          type="text"
          value={editingPlateNumber}
          onChange={(e) => setEditingPlateNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-4 py-2 text-white rounded ${
          saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}