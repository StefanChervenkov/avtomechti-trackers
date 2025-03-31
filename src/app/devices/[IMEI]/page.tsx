// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/app/lib/supabase";
// import { useParams } from "next/navigation";

// export default function DeviceDetailsPage({ params }: { params: { IMEI: string } }) {
//   const { IMEI } = useParams(); // Extract IMEI from the URL
//   const [device, setDevice] = useState<any>(null); // Device data
//   const [formData, setFormData] = useState<any>({}); // Editable form data
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false); // Save state

//   // Fetch device details
//   useEffect(() => {
//     const fetchDeviceDetails = async () => {
//       const { data, error } = await supabase
//         .from("trackers")
//         .select("*")
//         .eq("IMEI", IMEI) // Query by IMEI
//         .single(); // Fetch a single device

//       if (error) {
//         console.error("Error fetching device details:", error.message);
//       } else {
//         setDevice(data);
//         setFormData(data); // Initialize form data with fetched device data
//       }

//       setLoading(false);
//     };

//     fetchDeviceDetails();
//   }, [IMEI]);

//   // Handle form input changes
//   const handleInputChange = (field: string, value: any) => {
//     setFormData((prevFormData: any) => ({
//       ...prevFormData,
//       [field]: value,
//     }));
//   };

//   // Save the updated device data to the database
//   const handleSave = async () => {
//     setSaving(true);

//     const { error } = await supabase
//       .from("trackers")
//       .update(formData) // Update all fields with the form data
//       .eq("IMEI", IMEI); // Match the specific device by IMEI

//     setSaving(false);

//     if (error) {
//       console.error("Error saving device data:", error.message);
//       alert("Failed to save changes. Please try again.");
//     } else {
//       alert("Device data updated successfully!");
//       setDevice(formData); // Update the local state
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!device) {
//     return <p>Device not found.</p>;
//   }

//   return (
//     <div className="p-4 max-w-screen-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Device Details</h1>
//       <form className="space-y-4">
//         {Object.keys(formData).map((field) => (
//           <div key={field} className="mb-4">
//             <label className="block font-medium mb-2 capitalize">
//               {field.replace(/_/g, " ")}:
//             </label>
//             {typeof formData[field] === "boolean" ? (
//               // Render radio buttons for boolean fields
//               <div className="flex items-center space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name={field}
//                     value="true"
//                     checked={formData[field] === true}
//                     onChange={() => handleInputChange(field, true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name={field}
//                     value="false"
//                     checked={formData[field] === false}
//                     onChange={() => handleInputChange(field, false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             ) : (
//               // Render text input for other fields
//               <input
//                 type="text"
//                 value={formData[field] || ""}
//                 onChange={(e) => handleInputChange(field, e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleSave}
//           disabled={saving}
//           className={`px-4 py-2 text-white rounded ${
//             saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           {saving ? "Saving..." : "Save"}
//         </button>
//       </form>
//     </div>
//   );
// }