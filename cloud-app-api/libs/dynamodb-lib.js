
import AWS from "aws-sdk";

export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2" });

  return dynamoDb[action](params).promise();
}