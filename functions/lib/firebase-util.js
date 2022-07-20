const admin = require('firebase-admin')

/**
 * Authorizes the app with Firebase
 * @returns {Promise<admin>}
 */
async function authorize() {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
    console.log(serviceAccount)

    // Initialise the admin with the credentials
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })

    // Set up an instance of the DB
    // const db = admin.firestore()
    return admin;
}
/**
 * Test function
 * @param {*} db
 * @returns {Promise<string[]>}
 */
async function getTestData(db) {
    const data = await db.collection('activities').get()
    return data.docs.map(doc => doc.data())
}

/**
 * Gets list of Strava activities from Firestore
 * @param {*} db
 * @returns {Promise<Object[]>}
 */
async function getActivities(db) {
    const data = await db.collection('activities').get();
    return data.docs.map(doc => doc.data())
}

/**
 * Posts an activity to Firestore
 * @param {*} activity 
 * @param {*} db
 */
async function postActivity(activity, db) {
    const ref = await db.collection('activities').doc(`${activity.id}`).set(activity);
}

/**
 * Get authorization object from Firestore
 * @returns {Promise<admin.firestore.Firestore>}
 */
async function getAuth(db) {
    const auth = await db.collection("strava-auth").doc("auth").get();
    console.log(auth.data())
    return auth.data();
}

/**
 * Sets the authorization object in Firestore
 * @param {string} accessToken 
 * @param {number} expiresAt 
 * @param {string} refreshToken 
 * @param {*} db
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
    getAuth,
    setAuth
}