const admin = require('firebase-admin')

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

async function getTestData() {
    const db = await authorize();
    const data = await db.collection('activities').get()
    return data.docs.map(doc => doc.data())
}

module.exports = {
    authorize,
    getTestData
}