const { postActivity } = require("../lib/firebase-util");

const handler = async (event, context) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  let mode = event.queryStringParameters['hub.mode'];
  let token = event.queryStringParameters['hub.verify_token'];
  let challenge = event.queryStringParameters['hub.challenge'];
  console.log(event);
  console.log(event.queryStringParameters)
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
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({'error':'Missing mode or token'})
    }
  }
}

module.exports = { handler }