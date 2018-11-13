// Lambda function for updating information of a user

import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "cloud_app_user",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': path parameter
    Key: {
      userID: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET userName = :userName, skills = :skills",
    ExpressionAttributeValues: {
        ":userName": data.userName ? data.userName : null,
        ":skills": data.skills ? data.skills : null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}