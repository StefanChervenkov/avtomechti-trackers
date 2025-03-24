'use server';

export async function loginUserToDyegoo() {
    const userData = {
        Name: process.env.DYEGOO_USERNAME,
        Pass: process.env.DYEGOO_PASSWORD,
        AppId: "",
        Language: ""
    }


    const response = await fetch(`${process.env.DYEGOO_API}/api/User/Login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });


    if (response.ok) {
        return response.json();
    } else {
        console.log(`Error logging in user: ${response.statusText}`);
    }

}

export async function getAllSubUsers(accessToken: string, userId: number) {
    const response = await fetch(`${process.env.DYEGOO_API}/api/User/SubUsers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserId: userId,
            Token: accessToken,
            Language: "",
            AppId: ""
        }),
    });


    if (response.ok) {
        return response.json();
    } else {
        console.log(`Error getting sub users: ${response.statusText}`);
    }
}

export async function getDeviceDataByImei(imei: string, accessToken: string) {
    const response = await fetch(`${process.env.DYEGOO_API}/api/Device/GetDeviceByIMEI`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IMEI: imei,
            Token: accessToken,
            Language: "",
            AppId: ""
        }),
    });

    if (response.ok) {
        return response.json();

    } else {
        console.log(`Error getting device data: ${response.statusText}`);
    }
}

export async function getDeviceLocation(DeviceId: number, Token: string) {
    const response = await fetch(`${process.env.DYEGOO_API}/api/Location/Tracking`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            DeviceId,
            Token,
            MapType: '',
            Language: '',
            AppId: ''
        }),
    });

    if (response.ok) {
        return response.json();
    } else {
        console.log(`Error getting device location: ${response.statusText}`);
    }

}

