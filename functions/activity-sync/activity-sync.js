import { postActivity, authorize } from "../lib/firebase-util"
import { listActivityIds, getActivity } from "../lib/strava-api"

const handler = async (event) => {
  try {
    const db = await authorize();
    const activityIds = await listActivityIds(db);
    console.log(activityIds);
    const activities = await Promise.all(activityIds.map(async (id) => {
      const activity = await getActivity(id, db);
      return activity;
    }));

    console.log(activities);
    await Promise.all(activities.map(async (activity) => {
      await postActivity(activity, db);
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(activities)
    }
  } catch (error) {
    console.log(error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
