import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

const todosTable = process.env.TODOS_TABLE;
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const docClient = new (XAWS.DynamoDB as any).DocumentClient() as DocumentClient;

const getAllByUserId = async (userId: string): Promise<TodoItem[]> => {
  logger.info(`get all todos for users ${userId}`);

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

  logger.info(`get all todos for users ${userId} success`, result);

  return result.Items as TodoItem[];
};

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

const update = async (
  todoId: string,
  userId: string,
  todoUpdate: TodoUpdate
): Promise<void> => {
  logger.info(`update item ${todoId} for user ${userId}`, todoUpdate);
  await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId,
        todoId,
      },
      UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": todoUpdate.name,
        ":dueDate": todoUpdate.dueDate,
        ":done": todoUpdate.done,
      },
    })
    .promise();
  logger.info(`update item ${todoId} for user ${userId} success`, todoUpdate);
};

const remove = async (todoId: string, userId: string): Promise<void> => {
  logger.info(`delete item ${todoId} for user ${userId}`);

  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId,
        todoId,
      },
    })
    .promise();
  logger.info(`delete item ${todoId} for user ${userId} success`);
};

const setAttachmentUrl = async (
  todoId: string,
  userId: string
): Promise<void> => {
  const attachmentUrl = `https://${s3Bucket}.s3.amazonaws.com/${todoId}-${userId}`;

  logger.info(
    `setting attachment url for TODO ${todoId} and user ${userId}`,
    attachmentUrl
  );

  await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId,
        todoId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl,
      },
    })
    .promise();

  logger.info(
    `setting attachment url for TODO ${todoId} and user ${userId} success`,
    attachmentUrl
  );
};

export const TodosAccess = {
  put,
  update,
  delete: remove,
  getAllByUserId,
  setAttachmentUrl,
};
