exports.handler = async (event, context) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = event.queryStringParameters['hub.mode'];
  let token = event.queryStringParameters['hub.verify_token'];
  let challenge = event.queryStringParameters['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      return {
        statusCode: 200,
        body: JSON.stringify({"hub.challenge":challenge})
      }
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return {
        statusCode: 403,
        body: JSON.stringify({'error':'Verification tokens do not match'})
      }
    }
  } else {
    // Responds with '400 Bad Request' if mode or token is not present
    return {
      statusCode: 400,
      body: JSON.stringify({'error':'Missing mode or token'})
    }
  }
}
