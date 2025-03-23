'use server';

import { supabase } from "@/app/lib/supabase"; // Ensure this is the correct path to your Supabase client
import { loginUserToDyegoo, getAllSubUsers, getDeviceDataByImei } from "../utils/dyegoo";

export async function seedDeviceData() {
    const result = await loginUserToDyegoo();
    console.log(result);

    const accessToken = result.AccessToken;
    const userId = Number(result.Item.UserId);

    const subUsers = await getAllSubUsers(accessToken, userId);

    const devices = await Promise.all(
        subUsers.Items.map(async (subUser: any) => {
            const deviceData = await getDeviceDataByImei(subUser.Name, subUser.AccessToken);

            const deviceId = deviceData.Item.DeviceId;

            return {
                IMEI: subUser.Name,
                SubUserId: subUser.UserId,
                AccessToken: subUser.AccessToken,
                DeviceId: deviceId,
                PlateNumber: '',
            };
        })
    );

    console.log("Devices to be seeded:", devices.length);

    // Insert the devices into the "trackers" table
    const { data, error } = await supabase.from("trackers").insert(devices);

    if (error) {
        console.error("Error inserting devices into trackers table:", error.message);
        throw new Error(`Failed to seed trackers table: ${error.message}`);
    }

    console.log("Successfully seeded trackers table:", data);
}