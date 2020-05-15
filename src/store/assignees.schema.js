import { isType, validateSchema } from "@/utils";

export const assignee = {
  id: isType("number"),
  name: isType("string")
};

export const isAssignee = obj => validateSchema(obj, assignee);
