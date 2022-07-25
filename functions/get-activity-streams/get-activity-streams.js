import { authorize } from '../lib/firebase-util';
import { getActivityStreams } from '../lib/strava-api';

// get all activities from the database
const handler = async function (event, context) {
  try {
    const streamKeys = event.queryStringParameters.streams;
    const streamKeysArray = streamKeys.split(',');
    const activityId = event.queryStringParameters.id;

    const admin = await authorize();
    const db = admin.firestore();

    const activityStreams = await getActivityStreams(activityId, streamKeysArray, db);

    return {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      statusCode: 200,
      body: JSON.stringify(activityStreams)
    }
  } catch (error) {
    console.log(error)
    return { headers: {
      "Access-Control-Allow-Origin": "*"
    }, statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
