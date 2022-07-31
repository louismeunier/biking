import { Handler } from "@netlify/functions";
import { postActivity, deleteActivity, authorize } from "../lib/firebase-util";
import { getActivity } from "../lib/strava-api";

export const handler:Handler = async (event, context) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // @ts-ignore
  let mode = event.queryStringParameters['hub.mode'];
  // @ts-ignore
  let token = event.queryStringParameters['hub.verify_token'];
  // @ts-ignore
  let challenge = event.queryStringParameters['hub.challenge'];
  // @ts-ignore
  const body = JSON.parse(event.body);
  const aspect_type = body.aspect_type;

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

      const activityId = body.object_id;
      const admin = await authorize();
      const db = admin.firestore();

      const activityData = await getActivity(activityId, db);

      await postActivity(activityData, db);

      console.log(`Activity ${activityId} added to database`);

      // await db.terminate();
      // await admin.app().delete();

      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Activity synced"})
      }
    } else if (aspect_type == "delete") {
      console.log("Activity deleted");

      const activityId = body.object_id;
      const admin = await authorize();
      const db = admin.firestore();

      await deleteActivity(activityId, db);

      console.log(`Activity ${activityId} deleted from database`);

      // await db.terminate();
      // await admin.app().delete();

      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Activity deleted"})
      }
    } else if (aspect_type == "update") {
      console.log("Activity updated");
      // const activityId = event.body.object_id;
      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Activity updated"})
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