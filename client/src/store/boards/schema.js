import { isType, validatePartialSchema, validateSchema } from "@/utils";

export const assignee = {
  id: isType("number"),
  name: isType("string")
};

export const isAssignee = obj => validateSchema(obj, assignee);
export const isPartialAssignee = object =>
  validatePartialSchema(object, assignee);
