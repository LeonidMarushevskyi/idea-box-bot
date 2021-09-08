"use strict";
const payloads = require('./payloads');
const api = require('./api');
const utils = require('./utils');
const signature = require('./verifySignature');

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
        const slackData = utils.queryStringToJSON(requestJSON.body);
        console.log("Slack data: ", slackData);
        if (slackData.type === "url_verification") {
            response.body = JSON.stringify(signature.verifyCall(slackData));
        } else {
            let view = payloads.modal(slackData);
            console.log("Modal window request", view);
            let result = await api.callAPIMethod('views.open', view);
            console.log("Modal window response", result);
            response.body = JSON.stringify("Your Idea was processed and shared to Podio. Thank you!!!");
        }
    } catch (err) {
        response.statusCode = 404;
        response.body = err;
        console.error("Error processing request", err);
    } finally {
        console.log("Response command: ", response);
        return response;
    }
};
