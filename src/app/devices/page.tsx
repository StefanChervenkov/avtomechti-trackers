"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Debounced value
  const [searchMode, setSearchMode] = useState("IMEI"); // Default search mode is IMEI
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disableSuggestions, setDisableSuggestions] = useState(false); // New state to disable suggestions

  // Debounce logic: Update `debouncedSearchTerm` after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler); // Clear timeout if the user types again
    };
  }, [searchTerm]);

  // Fetch suggestions whenever `debouncedSearchTerm` changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (disableSuggestions || debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      let data, error;
      if (searchMode === "IMEI") {
        // Call the PostgreSQL function for partial matching on IMEI
        const response = await supabase.rpc("search_devices_by_imei", {
          search_term: debouncedSearchTerm,
        });
        data = response.data;
        error = response.error;
      } else {
        // Search by PlateNumber (text)
        const response = await supabase
          .from("trackers")
          .select("*")
          .ilike("PlateNumber", `%${debouncedSearchTerm}%`); // Case-insensitive partial match for PlateNumber
        data = response.data;
        error = response.error;
      }

      setLoading(false);

      if (error) {
        console.error("Error fetching devices:", error.message);
        return;
      }

      setSuggestions(data || []);
    };

    fetchSuggestions();
  }, [debouncedSearchTerm, searchMode, disableSuggestions]);

  const handleSuggestionClick = (device: any) => {
    setSelectedDevice(device);

    // Disable fetching suggestions temporarily
    setDisableSuggestions(true);

    // Clear suggestions
    setSuggestions([]);

    // Set the search term based on the selected mode
    setSearchTerm(searchMode === "IMEI" ? device.IMEI : device.PlateNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    // Re-enable fetching suggestions when the user types again
    setDisableSuggestions(false);
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>

      {/* Search Mode Toggle */}
      <div className="flex items-center mb-4">
        <label className="mr-2 font-medium">Search by:</label>
        <select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="IMEI">IMEI</option>
          <option value="PlateNumber">Plate Number</option>
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={`Search by ${searchMode}`}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Loading Indicator */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 rounded mb-4 bg-white shadow-md">
          {suggestions.map((device) => (
            <li
              key={device.DeviceId}
              onClick={() => handleSuggestionClick(device)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {searchMode === "IMEI" ? device.IMEI : device.PlateNumber}
            </li>
          ))}
        </ul>
      )}

      {/* Device Details */}
      {selectedDevice && (
        <div className="p-4 border border-gray-300 rounded bg-white shadow-md">
          <h2 className="text-xl font-bold mb-2">Device Details</h2>
          <p>
            <strong>IMEI:</strong> {selectedDevice.IMEI}
          </p>
          <p>
            <strong>Plate Number:</strong> {selectedDevice.PlateNumber}
          </p>
          <p>
            <strong>Device ID:</strong> {selectedDevice.DeviceId}
          </p>
        </div>
      )}
    </div>
  );
}