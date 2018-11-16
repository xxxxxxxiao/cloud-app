// Lambda function for creating a user

import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    // Table name in DynamoDb
    TableName: "cloud_app_user",
    // Features to be created
    Item: {
      userID: uuid.v1(),
      userName: data.userName,
      email: data.email,
      skills: data.skills
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}