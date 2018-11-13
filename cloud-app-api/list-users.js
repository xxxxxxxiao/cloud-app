// Lambda function to list all users in the table in DynamoDB

import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: "cloud_app_user",

  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    // Return all items in response body
    callback(null, success(result.Items));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}