"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { getDeviceLocation } from "@/app/utils/dyegoo";

export default function ActiveDevicesPage() {
  interface Device {
    IMEI: string;
    PlateNumber: string;
    DeviceId: string;
    AccessToken: string;
    // Add other fields as needed
  }

  const [devices, setDevices] = useState<Device[]>([]); // All active devices
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]); // Devices to display
  const [loading, setLoading] = useState(true);
  const [showNotWorking, setShowNotWorking] = useState(false); // Toggle for "Not Working" filter

  useEffect(() => {
    const fetchActiveDevices = async () => {
      const { data, error } = await supabase
        .from("trackers")
        .select("*")
        .neq("PlateNumber", ""); // Filter devices where PlateNumber is not an empty string

      if (error) {
        console.error("Error fetching active devices:", error.message);
      } else {
        setDevices(data || []);
        setFilteredDevices(data || []); // Initialize filtered devices with all active devices
      }

      setLoading(false);
    };

    fetchActiveDevices();
  }, []);

  // Handle "Check Not Working" button click
  const handleCheckNotWorking = async () => {
    if (showNotWorking) {
      // If the filter is already active, reset to show all devices
      setFilteredDevices(devices);
      setShowNotWorking(false);
    } else {
      const notWorkingDevices = [];

      for (const device of devices) {
        try {
          const locationData = await getDeviceLocation(device.DeviceId, device.AccessToken);
          console.log(`Device IMEI: ${device.IMEI}`, locationData);

          // Placeholder logic: Add your actual logic to determine if the device is not working
          if (locationData && locationData.Item.Status < 1) {
            notWorkingDevices.push(device);
          }
        } catch (error) {
          console.error(`Error fetching location for device IMEI: ${device.IMEI}`, error);
        }
      }

      setFilteredDevices(notWorkingDevices);
      setShowNotWorking(true);
    }
  };

  if (loading) {
    return <p>Loading active devices...</p>;
  }

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Active Devices</h1>

      {/* Button to toggle "Not Working" filter */}
      <button
        onClick={handleCheckNotWorking}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showNotWorking ? "Show All Devices" : "Check Not Working"}
      </button>

      {/* Display message if no devices match the filter */}
      {filteredDevices.length === 0 && (
        <p>No devices found for the current filter.</p>
      )}

      {/* Display the list of filtered devices */}
      <ul className="space-y-4">
        {filteredDevices.map((device) => (
          <li
            key={device.IMEI}
            className="p-4 border border-gray-300 rounded bg-white shadow-md"
          >
            <p>
              <strong>IMEI:</strong> {device.IMEI}
            </p>
            <p>
              <strong>Plate Number:</strong> {device.PlateNumber}
            </p>
            <Link href={`/devices/${device.IMEI}`}>
              <p className="text-blue-500 cursor-pointer">View Details</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}