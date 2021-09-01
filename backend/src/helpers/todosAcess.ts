import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
// import { TodoUpdate } from "../models/TodoUpdate";

// const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

const todosTable = process.env.TODOS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();

const put = async (todoItem: TodoItem): Promise<TodoItem> => {
  logger.info("put to do item", todoItem);
  await docClient
    .put({
      TableName: todosTable,
      Item: todoItem,
    })
    .promise();

  logger.info("put todo item success");
  return todoItem;
};

export const TodosAccess = {
  put,
};
