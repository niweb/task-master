import moment from "moment";
import {
  isArrayOf,
  isInstance,
  isNull,
  isType,
  validatePartialSchema,
  validateSchema
} from "@/utils";
import { assignee } from "@/store/assignees/schema";
import { project } from "@/store/projects/schema";

const task = {
  id: isType("number"),
  title: isType("string"),
  assignee: assignee.id,
  project: value => project.id(value) || isNull(value),
  start: isInstance(moment),
  end: isInstance(moment),
  links: isArrayOf("number")
};

export const isTask = object => validateSchema(object, task);
export const isPartialTask = object => validatePartialSchema(object, task);
