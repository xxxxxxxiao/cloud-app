// Lambda function to send email to users

import AWS from "aws-sdk";
import { success, failure } from "./libs/response-lib";

var ses = new AWS.SES({
  region: 'eu-west-1'
});

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  var params = {
    Destination: {
        ToAddresses: [data.receiver]
    },
    Message: {
        Body: {
            Text: {
                Data: data.content,
                Charset: 'UTF-8'
            }
        },
        Subject: {
            Data: data.subject,
            Charset: 'UTF-8'
        }
    },
    Source: "xx2n18@soton.ac.uk"
}

  try {
    // Call SES service to send email
    const result = await ses.sendEmail(params).promise();
    callback(null, success({ status: true }));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }

  
};