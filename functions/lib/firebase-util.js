import admin from 'firebase-admin';

/**
 * Authorizes the app with Firebase
 * @returns {Promise<admin>}
 */
async function authorize() {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}
/**
 * Test function
 * @param {*} db An instance of the Firestore database
 * @returns {Promise<string[]>}
 */
async function getTestData(db) {
    const data = await db.collection('activities').get()
    return data.docs.map(doc => doc.data())
}

/**
 * Gets list of Strava activities from Firestore
 * @param {*} db An instance of the Firestore database
 * @returns {Promise<Object[]>}
 */
async function getActivities(db) {
    const data = await db.collection('activities').where('type', '==', 'Ride').get();
    return data.docs.map(doc => doc.data())
}

/**
 * Posts an activity to Firestore
 * @param {*} activity An object containing the activity data
 * @param {*} db An instance of the Firestore database
 */
async function postActivity(activity, db) {
    const ref = await db.collection('activities').doc(`${activity.id}`).set(activity);
}

/**
 * Deletes an activity from Firestore
 * @param {*} activityId The Strava ID of the activity
 * @param {*} db An instance of the Firestore database
 */
async function deleteActivity(activityId, db) {
    await db.collection("activities").doc(`${activityId}`).delete();
}

/**
 * Get authorization object from Firestore
 * @param {*} db An instance of the Firestore database
 * @returns {Promise<admin.firestore.Firestore>}
 */
async function getAuth(db) {
    const auth = await db.collection("strava-auth").doc("auth").get();
    return auth.data();
}

/**
 * Sets the authorization object in Firestore
 * @param {string} accessToken The access token
 * @param {number} expiresAt The time the token expires
 * @param {string} refreshToken The refresh token
 * @param {*} db An instance of the Firestore database
 */
async function setAuth(accessToken, expiresAt, refreshToken, db) {
    await db.collection("strava-auth").doc("auth").set({
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: refreshToken
    })
}

module.exports = {
    authorize,
    getActivities,
    postActivity,
    deleteActivity,
    getAuth,
    setAuth
}