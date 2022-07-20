const admin = require('firebase-admin')

/**
 * Authorizes the app with Firebase
 * @returns {Promise<admin.firestore.Firestore>}
 */
async function authorize() {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
    console.log(serviceAccount)

    // Initialise the admin with the credentials
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })

    // Set up an instance of the DB
    const db = admin.firestore()

    return db;
}

/**
 * Test function
 * @returns {Promise<admin.firestore.Firestore>}
 */
async function getTestData() {
    const db = await authorize();
    const data = await db.collection('activities').get()
    return data.docs.map(doc => doc.data())
}

/**
 * Gets list of Strava activities from Firestore
 * @returns {Promise<admin.firestore.Firestore>}
 */
async function getActivities() {
    const db = await authorize();
    const data = await db.collection('activities').get()
    return data.docs.map(doc => doc.data())
}

/**
 * Posts an activity to Firestore
 * @param {*} activity 
 */
async function postActivity(activity) {
    const db = await authorize();
    const ref = await db.collection('activities').doc(activity.id).set(activity);
}

/**
 * Get authorization object from Firestore
 * @returns {Promise<admin.firestore.Firestore>}
 */
async function getAuth() {
    const db = await authorize();
    const auth = await db.collection("strava-auth.auth").doc("auth").get()
    return auth.docs.map(doc => doc.data())
}

/**
 * Sets the authorization object in Firestore
 * @param {string} accessToken 
 * @param {number} expiresAt 
 * @param {string} refreshToken 
 */
async function setAuth(accessToken, expiresAt, refreshToken) {
    const db = await authorize();
    await db.collection("strava-auth.auth").doc("auth").set({
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: refreshToken
    })
}

module.exports = {
    authorize,
    getActivities,
    postActivity,
    getAuth,
    setAuth
}