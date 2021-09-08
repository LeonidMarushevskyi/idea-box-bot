const axios = require('axios');
const qs = require('querystring');
const apiUrl = 'https://slack.com/api';

const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN;

const callAPIMethod = async (method, payload) => {
    let data = Object.assign({token: SLACK_API_TOKEN}, payload);
    let result = await axios.post(`${apiUrl}/${method}`, qs.stringify(data));
    return result.data;
}

module.exports = {
    callAPIMethod
}