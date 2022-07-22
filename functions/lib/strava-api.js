import fetch from "node-fetch";
import { getAuth, setAuth } from "./firebase-util";

const BASE_URL = route => `https://www.strava.com/api/v3${route}`;

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

/**
 * Gets a new refresh token from Strava.
 * @param {string} refreshToken The refresh token
 * @param {*} db
 * @returns {Promise} The refresh token
 */
async function getRefreshToken(refreshToken, db) {
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
 * @param {*} db
 * @returns {Promise} The authorization token
 */
async function getAuthorizationToken(db) {
    let auth = await getAuth(db);
    console.log(auth);
    if (auth.expires_at < new Date().getTime()/1000 - 60) {
        auth = await getRefreshToken(auth.refresh_token, db);
    }

    return auth.access_token;
}

/**
 * Gets data for a Strava activity based on its ID.
 * @param {number} activityId The Strava ID of the activity
 * @param {*} db
 * @returns {Promise} The activity data
 */
async function getActivity(activityId, db) {
    const authToken = await getAuthorizationToken(db);

    const url = BASE_URL(`/activities/${activityId}`);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } });
    const activity = await response.json();

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
 * @param {*} db
 * @returns {Promise} A list of activity IDs
 */
async function listActivityIds(db) {
    const authToken = await getAuthorizationToken(db);
    // const startDate = new Date().getTime();
    // const endDate = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const url = BASE_URL("/athlete/activities");
    const response = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } });
    const activities = await response.json();
    console.log(activities);
    return activities.map(activity => activity.id);
}

module.exports = {
    getActivity,
    listActivityIds
}