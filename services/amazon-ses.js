require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES({ apiVersion: 'latest' });

module.exports = (ToAddresses, subject, rawMessage, htmlMessage) => {
  return new Promise((resolve, reject) => {
    ses.sendEmail(
      {
        Source: `${process.env.SITE_NAME} <${process.env.NOREPLY_EMAIL}>`,
        Destination: {
          ToAddresses,
        },
        Message: {
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: htmlMessage,
            },
          },
        },
      },
      (err, info) => {
        if (err) reject(err);
        else resolve(info);
      },
    );
  });
};
