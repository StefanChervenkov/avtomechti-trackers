// filepath: c:\WebDev\avtomechti-trackers\src\pages\api\seed.ts
//import { supabase } from "@/app/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("Seeding database...");

    // Insert test users
    
   
  

    // Add more seeding logic here for other tables if needed

  } catch (error) {
    console.error("Error seeding database:", error);
    return res.status(500).json({ success: false, message: "Error seeding database", error });
  }
}