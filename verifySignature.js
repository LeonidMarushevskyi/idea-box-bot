const crypto = require("crypto");
const timingSafeCompare = require("tsscmp");
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;

function legitSlackRequest(req) {
    // Grab the signature and timestamp from the headers
    const requestSignature = req.headers['X-Slack-Signature'];
    const requestTimestamp = req.headers['X-Slack-Request-Timestamp'];

    // Check if the timestamp is too old
    const fiveMinutesAgo = ~~(Date.now() / 1000) - (60 * 5);
    if (requestTimestamp < fiveMinutesAgo) return false;

    // Create the HMAC
    const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET);

    // Update it with the Slack Request
    const [version, hash] = requestSignature.split('=');
    const base = `${version}:${requestTimestamp}:${req.body}`;
    hmac.update(base);

    // Returns true if it matches
    return timingSafeCompare(hash, hmac.digest('hex'));
}

function verifyCall(data) {
    if (data.token === SLACK_VERIFICATION_TOKEN) {
        return data.challenge;
    } else {
        throw "Slack token verification failed";
    }
}

module.exports = { verifyCall, legitSlackRequest };
