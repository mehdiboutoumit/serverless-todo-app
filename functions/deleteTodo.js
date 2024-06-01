import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,

  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "todos";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "event" : event.pat,
    "cont" : context
  };
  try {
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: requestJSON.id,
            },
          })
        );
        body = `Deleted todo ${requestJSON.id}`;
      
   
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
