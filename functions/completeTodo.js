import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "todos";

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  try {
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new UpdateCommand({
            TableName: tableName,
            Key: { id: requestJSON.id },
            UpdateExpression: "set completed = :completed",
            ExpressionAttributeValues: {
              ":completed": true,
            },
            ReturnValues: "ALL_NEW",
          })
        );
        body = `Completed todo ${requestJSON.id}`;
      
   
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
