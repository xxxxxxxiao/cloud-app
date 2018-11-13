// Lambeda function for creating a project

import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    // Table name in DynamoDb
    TableName: "cloud_app",
    // Features to be created
    Item: {
      noteID: uuid.v1(),
      content: data.content,
      title: data.title,
      sta: data.sta,
      manager: data.manager,
      developers: data.developers,
      createdAt: Date.now()
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