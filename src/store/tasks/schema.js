import moment from "moment";
import {
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
  end: isInstance(moment)
};

export const isTask = object => validateSchema(object, task);
export const isPartialTask = object => validatePartialSchema(object, task);
