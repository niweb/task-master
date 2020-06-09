import moment from "moment";
import {
  isInstance,
  isType,
  validatePartialSchema,
  validateSchema
} from "@/utils";
import { assignee } from "@/store/assignees/schema";

const task = {
  id: isType("number"),
  title: isType("string"),
  assignee: assignee.id,
  start: isInstance(moment),
  end: isInstance(moment)
};

export const isTask = object => validateSchema(object, task);
export const isPartialTask = object => validatePartialSchema(object, task);
