"use strict";
const axios = require('axios');
const utils = require('./utils');
const signature = require("./verifySignature");
const PODIO_APP_ID = process.env.PODIO_APP_ID;
const PODIO_APP_TOKEN = process.env.PODIO_APP_TOKEN;
const PODIO_CLIENT_ID = process.env.PODIO_CLIENT_ID;
const PODIO_CLIENT_SECRET = process.env.PODIO_CLIENT_SECRET;

module.exports.run = async (event) => {
    let response = {
        statusCode: 200,
        body: {},
        headers: {"X-Slack-No-Retry": 1}
    }
    try {
        if (!signature.legitSlackRequest(event)) {
            console.error("Signature verification error", event);
            throw "Signature verification error";
        }
        console.log("Request: ", event);
        let request = JSON.stringify(event);
        let requestJSON = JSON.parse(request);
        let payload = utils.queryStringToJSON(requestJSON.body).payload;
        let payloadDecoded = decodeURI(payload);
        const slackData = JSON.parse(payloadDecoded);
        console.log("Payload JSON: ", slackData);
        if (slackData.type === "url_verification") {
            response.body = JSON.stringify(signature.verifyCall(slackData));
        } else {
            await sendIdeaToPodio(slackData, requestJSON);
            response.body = JSON.stringify({});
        }
    } catch (err) {
        response.statusCode = 404;
        response.body = err;
        console.error("Error processing request", err);
    } finally {
        console.log("Response interactive: ", response);
        return response;
    }
};

async function createPodioItem(slackData, accessToken, requestJSON) {
    console.log("Slack state: ", slackData.view.state.values)
    let author = slackData.user.name;
    if (slackData.view.state.values.anonymous_block.anonymous.selected_option.value == "Yes") {
        author = " ";
    }
    let itemRequest = {
        external_id: requestJSON.requestContext.requestId,
        fields: {
            title: utils.cleanUp(slackData.view.state.values.title_block.title.value),
            idea: utils.cleanUp(slackData.view.state.values.description_block.description.value),
            category: parseInt(slackData.view.state.values.category_block.category.selected_option.value),
            author: author
        }
    }
    let response = await axios.post('https://api.podio.com/item/app/'+PODIO_APP_ID+'/', itemRequest, {
        headers: {
            Authorization: 'OAuth2 ' + accessToken,
            "Content-Type": "application/json"
        }
    });
    console.log("Podio item create response: ", response);
}

async function sendIdeaToPodio(slackData, requestJSON) {
    let grant_type = "app";
    let app_id = PODIO_APP_ID;
    console.log("app_id !!!!!", app_id);
    let app_token = PODIO_APP_TOKEN;
    let client_id = PODIO_CLIENT_ID;
    let client_secret = PODIO_CLIENT_SECRET;
    let response = await axios.post("https://podio.com/oauth/token", null, {
        params: {
            grant_type,
            app_id,
            app_token,
            client_id,
            client_secret
        }
    });
    let accessToken = response.data.access_token;
    await createPodioItem(slackData, accessToken, requestJSON);
}
