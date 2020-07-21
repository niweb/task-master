import { isType, validatePartialSchema, validateSchema } from "@/utils";

export const project = {
  id: isType("number"),
  name: isType("string"),
  color: isType("string")
};

export const isProject = obj => validateSchema(obj, project);
export const isPartialProject = object =>
  validatePartialSchema(object, project);
