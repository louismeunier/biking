import { postActivity } from "../lib/firebase-util"
import { listActivityIds, getActivity } from "../lib/strava-api"

const handler = async (event) => {
  try {
    const activityIds = await listActivityIds();
    console.log(activityIds);
    const activities = await Promise.all(activityIds.map(async (id) => {
      const activity = await getActivity(id);
      return activity;
    }));

    console.log(activities);
    await Promise.all(activities.map(async (activity) => {
      await postActivity(activity);
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(activities)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
