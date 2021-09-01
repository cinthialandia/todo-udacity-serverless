import * as uuid from "uuid";
// import * as createError from "http-errors";

import { TodosAccess } from "./todosAcess";
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";

const logger = createLogger("todos");

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  logger.info(`Getting TODOs for user: ${userId}`);

  const todosForUser = TodosAccess.getAllByUserId(userId);

  logger.info(`Got TODOs for user ${userId}`, todosForUser);

  return todosForUser;
};

export const createTodo = async (
  userId: string,
  newTodoRquest: CreateTodoRequest
): Promise<TodoItem> => {
  logger.info(`Creating a TODO for user ${userId}`);
  const newTodo: TodoItem = {
    name: newTodoRquest.name,
    dueDate: new Date(newTodoRquest.dueDate).toISOString(),
    userId,
    todoId: uuid(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  const result = await TodosAccess.put(newTodo);

  logger.info(`Created a TODO for user ${userId}`, result);

  return result;
};

export const updateTodo = async (
  todoId: string,
  userId: string,
  updatedTodoRequest: UpdateTodoRequest
): Promise<void> => {
  logger.info(`Updating TODO ${todoId} for user ${userId}`, updatedTodoRequest);

  await TodosAccess.update(todoId, userId, updatedTodoRequest);

  logger.info(`Updated TODO ${todoId} for user ${userId}`, updatedTodoRequest);
};

export const deleteTodo = async (
  todoId: string,
  userId: string
): Promise<void> => {
  logger.info(`Deleting TODO ${todoId} for user ${userId}`);

  await TodosAccess.delete(todoId, userId);

  logger.info(`Deleted TODO ${todoId} for user ${userId}`);
};
