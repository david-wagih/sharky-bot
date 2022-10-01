const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const getCode = async (req) => {
    client
        .verify
        .services(process.env.VERIFY_SERVICE_SID)
        .verifications
        .create({
            to: `+${req}`,
            channel: "sms"
        })
        .then(data => {
            return data;
        })
};

const verifyCode = async (req, code) => {
    client
        .verify
        .services(process.env.VERIFY_SERVICE_SID)
        .verificationChecks
        .create({
            to: `+${req}`,
            code: code,
        })
        .then(data => {
            return data;
        });
};

module.exports = getCode, verifyCode;