"use client";

import React, { useState, useTransition, useEffect } from "react";
import * as deviceActions from "@/app/actions/deviceActions";



import Link from 'next/link';

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState("IMEI"); // Default search mode is IMEI
  const [suggestions, setSuggestions] = useState<{ DeviceId: string; IMEI: string; PlateNumber: string }[]>([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isPending, startTransition] = useTransition();

  // 🕒 Debounce Effect: Waits 500ms before setting debouncedSearchTerm
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🔄 Fetch Suggestions Effect: Fetches suggestions based on the debounced search term
  useEffect(() => {
    if (!debouncedSearchTerm) return; // Skip if the search term is empty

    startTransition(async () => {
      if (searchMode === "IMEI") {
        const searchResults = await deviceActions.searchByIMEI(debouncedSearchTerm);
        setSuggestions(searchResults);
        console.log(searchResults);
      } else {
        const searchResults = await deviceActions.searchByPlateNumber(debouncedSearchTerm);
        setSuggestions(searchResults);
        console.log(searchResults);
      }
    });

  }, [debouncedSearchTerm]);

  //Todo fix the types
  const handleSuggestionClick = (device: any) => {
    setSelectedDevice(device);
    setSuggestions([]);

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
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Search by ${searchMode}`}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Loading Indicator */}
      {isPending && <p className="text-gray-500">Loading...</p>}

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
          <Link href={`/devices/${selectedDevice.IMEI}`}>
            <p className="text-blue-500 cursor-pointer">Device details</p>

          </Link>
        </div>
      )}
    </div>
  );
}