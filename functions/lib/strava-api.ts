import { firestore } from "firebase-admin";
import fetch from "node-fetch";
import { getAuth, setAuth } from "./firebase-util";

const BASE_URL = route => `https://www.strava.com/api/v3${route}`;

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

/**
 * Gets a new refresh token from Strava.
 * @param {string} refreshToken The refresh token
 * @param {*} db An instance of the Firestore database
 * @returns {Promise} The refresh token
 */
export async function getRefreshToken(refreshToken, db) {
    const url = BASE_URL(`/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`);
    const refresh = await fetch(url, { method: "POST" });
    const refreshData = await refresh.json();

    setAuth(
        refreshData.access_token,
        refreshData.expires_at,
        refreshData.refresh_token,
        db
    );
    return refreshData;
}

/**
 * Gets the authorization token for the Strava API. If it has expired, it refreshes the token and sets it in the database.
 * @param {*} db An instance of the Firestore database
 * @returns {Promise} The authorization token
 */
export async function getAuthorizationToken(db) {
    let auth = await getAuth(db);

    if (auth.expires_at < new Date().getTime()/1000 - 60) {
        auth = await getRefreshToken(auth.refresh_token, db);
    }

    return auth.access_token;
}

/**
 * Gets data for a Strava activity based on its ID.
 * @param {number} activityId The Strava ID of the activity
 * @param {*} db An instance of the Firestore database
 * @returns {Promise} The activity data
 */
export async function getActivity(activityId, db) {
    const authToken = await getAuthorizationToken(db);

    const url = BASE_URL(`/activities/${activityId}`);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } });
    const activity = await response.json();

    // const activityStream = await getActivityStreams(activityId, db);

    const fmtData =  {
        id: activity?.id,
        name: activity?.name,
        type: activity?.type,
        distance: activity?.distance,
        moving_time: activity?.moving_time,
        elapsed_time: activity?.elapsed_time,
        start_date: activity?.start_date,
        map: activity?.map?.polyline,
        start_latlng: activity?.start_latlng,
        end_latlng: activity?.end_latlng,
        average_speed: activity?.average_speed,
        max_speed: activity?.max_speed,
        average_watts: activity?.average_watts,
        kilojoules: activity?.kilojoules,
        average_heartrate: activity?.average_heartrate,
        max_heartrate: activity?.max_heartrate,
        calories: activity?.calories
    }

    Object.keys(fmtData).forEach(key => {
        if (fmtData[key] === undefined) {
            fmtData[key] = null;
        }
    }
    );
    return fmtData;
}

/**
 * Get a list of Strava activity IDs
 * @param {*} db An instance of the Firestore database
 * @returns {Promise} A list of activity IDs
 */
export async function listActivityIds(db, limit) {
    const authToken = await getAuthorizationToken(db);
    // const startDate = new Date().getTime();
    // const endDate = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
    if (limit === undefined) {
        limit = 30;
    }
    const url = BASE_URL(`/athlete/activities?per_page=${limit}`);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } });
    const activities = await response.json();

    return activities.map(activity => activity.id);
}

/**
 * Get data streams for a Strava activity
 * @param {string[]} activityId The Strava ID of the activity
 * @param {string[]} streams The list of streams to get
 * @param {*} db An instance of the Firestore database
 */
export async function getActivityStreams(activityIds:string[], streams:string[], db) {
    // this is really dirty man idk
    const authToken = await getAuthorizationToken(db);
    const formattedResponsesArray = await Promise.all(activityIds.map(async activityId => {
        const url = BASE_URL(`/activities/${activityId}/streams/?keys=` + streams.join(","));
        const response = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } });
        const activityStream = await response.json();
        const formattedResponse: { [key: string]: any[]; }  = {};

        activityStream.forEach(stream => {
            if (stream.type === "latlng") {
                formattedResponse.latlng = stream.data.map(point => { return {lat: point[0], lng: point[1]} });
            } else {
                formattedResponse[stream.type] = stream.data;
            }
        });

        // response.activityId = formattedResponse;
        return formattedResponse;
    }))

    const response:{ [key: number]: { [key: string]: any[] }} = {};

    formattedResponsesArray.forEach((formattedResponse, index) => {
        response[activityIds[index]] = formattedResponse;
    })
    return response;
}