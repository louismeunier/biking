import { Handler } from '@netlify/functions'
import { postActivity, authorize, getActivities } from "../lib/firebase-util"
import { listActivityIds, getActivity } from "../lib/strava-api"

export const handler: Handler = async (event) => {
  try {
    const queryStringParameters = event.queryStringParameters
    const force = queryStringParameters?.force || false;
    const num = queryStringParameters?.num;
    const admin = await authorize();
    const db = admin.firestore();

    const activityIds = await listActivityIds(db, num);

    const dbActivities = await getActivities(db);
    const dbActivitiesIds = dbActivities.map(activity => activity.id);

    const missingIds = activityIds.filter(id => !dbActivitiesIds.includes(id));

    if (missingIds.length == 0 && !force) {
      // await db.terminate();
      // await admin.app().delete();
      
      return {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
        body: JSON.stringify({"message": "Activities already synced"})
      }
    } else {
      const activities = await Promise.all(activityIds.map(async (id) => {
        const activity = await getActivity(id, db);
        return activity;
      }));

      await Promise.all(activities.map(async (activity) => {
        await postActivity(activity, db);
      }));

      // await db.terminate();
      // await admin.app().delete();

      return {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
        body: JSON.stringify({"message": "Activities synced"})
      }
    }
  } catch (error) {
    console.log(error)
    return { headers: {
      "Access-Control-Allow-Origin": "*"
    }, statusCode: 500, body: error.toString() }
  }
}