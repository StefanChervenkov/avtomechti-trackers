'use server';

import { supabase } from "@/app/lib/supabase"; // Ensure this is the correct path to your Supabase client


export async function searchByPlateNumber(plateNumber: string) {
    const { data, error } = await supabase.from("trackers").select().ilike("PlateNumber", `%${plateNumber}%`);

    if (error) {
        console.error("Error searching for device by plate number:", error.message);
        throw new Error(`Failed to search for device by plate number: ${error.message}`);
    }

    return data;
}

export async function searchByIMEI(imei: string) {
    const { data, error } = await supabase.rpc("search_devices_by_imei", {search_term: imei});
        

    if (error) {
        console.error("Error searching for device by IMEI:", error.message);
        throw new Error(`Failed to search for device by IMEI: ${error.message}`);
    }

    return data;
}

//Todo adjust the search methods