import * as AWS from "aws-sdk";
// import * as uuid from "uuid";
// import * as createError from "http-errors";

// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from "../models/TodoItem";
// import { CreateTodoRequest } from "../requests/CreateTodoRequest";
// import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";

const todosTable = process.env.TODOS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();
const logger = createLogger("todos");

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  logger.info(`Getting TODOs for user: ${userId}`);

  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false,
    })
    .promise();

  logger.info(`Got TODOs for user ${userId}`, result);

  return result.Items as TodoItem[];
};
