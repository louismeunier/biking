import { Handler } from '@netlify/functions'
import { authorize } from '../lib/firebase-util';
import { getActivityStreams } from '../lib/strava-api';

// get all activities from the database
export const handler: Handler = async function (event, context) {
  try {
    const queryStringParameters = event.queryStringParameters;
    const streamKeys = queryStringParameters?.streams;
    const activityIds = queryStringParameters?.ids;

    if (!streamKeys || !activityIds) {
      return {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        statusCode: 400,
        body: JSON.stringify({"message": "Missing required parameters"})
      }
    }
    
    const streamKeysArray = streamKeys.split(',');
    const activityIdsArray = activityIds.split(',');

    const admin = await authorize();
    const db = admin.firestore();

    const activityStreams = await getActivityStreams(activityIdsArray, streamKeysArray, db);

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
