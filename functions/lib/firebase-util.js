const admin = require('firebase-admin')

async function authorize() {
    const serviceAccount = process.env.NODE_ENV 
    ? JSON.parse(process.env.SERVICE_ACCOUNT)
    : require('./serviceAccount.json')

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