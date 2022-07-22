import { postActivity, deleteActivity, authorize } from "../lib/firebase-util";
import { getActivity } from "../lib/strava-api";

const handler = async (event, context) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  let mode = event.queryStringParameters['hub.mode'];
  let token = event.queryStringParameters['hub.verify_token'];
  let challenge = event.queryStringParameters['hub.challenge'];
  console.log(JSON.parse(event.body).aspect_type);
  const aspect_type = JSON.parse(event.body).aspect_type;

  try {
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        return {
          statusCode: 200,
          body: JSON.stringify({"hub.challenge":challenge})
        }
      } else {
        return {
          statusCode: 403,
          body: JSON.stringify({'error':'Verification tokens do not match'})
        }
      }
    } else if (aspect_type == "create") {
      console.log("New activity created");
      const activityId = event.body.object_id;
      const admin = await authorize();
      const db = admin.firestore();

      const activityData = await getActivity(activityId, db);

      await postActivity(activityData, db);

      console.log(`Activity ${activityId} added to database`);

      await db.terminate();
      await admin.app().delete();

      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Activity synced"})
      }
    } else if (event.body.aspect_type == "delete") {
      console.log("Activity deleted");

      const activityId = event.body.object_id;
      const admin = await authorize();
      const db = admin.firestore();

      await deleteActivity(activityId, db);

      console.log(`Activity ${activityId} deleted from database`);

      await db.terminate();
      await admin.app().delete();

      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Activity deleted"})
      }
    } else {
    console.log("Something went wrong");
    return {
      statusCode: 400,
      body: JSON.stringify({'error':'Missing mode or token'})
    }
    } 
  } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: JSON.stringify({'error':error})
      }
    }
}

module.exports = { handler }