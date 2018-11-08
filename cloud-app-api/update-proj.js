import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "cloud_app",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      //userID: event.requestContext.identity.cognitoIdentityId,
      noteID: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, title = :title, sta = :sta, manager = :manager, developers = :developers",
    ExpressionAttributeValues: {
        
        ":content": data.content ? data.content : null,
        ":title": data.title ? data.title : null,
        ":sta": data.sta ? data.sta : null,
        ":manager": data.manager ? data.manager : null,
        ":developers": data.developers ? data.developers : null

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