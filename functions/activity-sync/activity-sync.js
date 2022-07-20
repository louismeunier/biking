import { postActivity, authorize, getActivities } from "../lib/firebase-util"
import { listActivityIds, getActivity } from "../lib/strava-api"

const handler = async (event) => {
  try {
    const admin = await authorize();
    const db = admin.firestore();

    const activityIds = await listActivityIds(db);

    const dbActivities = await getActivities(db);
    const dbActivitiesIds = dbActivities.map(activity => activity.id);

    const missingIds = activityIds.filter(id => !dbActivitiesIds.includes(id));

    if (missingIds.length == 0) {
      await db.terminate();
      await admin.app().delete();
      
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

      await db.terminate();
      await admin.app().delete();

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

module.exports = { handler }
