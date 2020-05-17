/**
 * Generate a new id, that is not yet assigned
 */
export const generateNewId = currentIds => {
  const ids = currentIds.map(id => Number(id));
  const maxId = Math.max(...ids);
  return ids.length > 0 ? maxId + 1 : 0;
};

/** =========================
 *  Validating Object Schemas
 *  =========================
 */
export const isType = type => value => typeof value === type;
export const isInstance = type => value => value instanceof type;

/**
 * Validate if a given object has _all_ properties required by the schema
 */
export const validateSchema = (object, schema) => {
  const propertyMatchesSchema = createPropertyValidator(object, schema);
  return (
    Object.keys(schema).filter(key => !propertyMatchesSchema(key)).length < 1
  );
};

/**
 * Validates if a given object's properties match the schema
 * Does not need to be complete and can include fields not in schema
 */
export const validatePartialSchema = (object, schema) => {
  const propertyMatchesSchema = createPropertyValidator(object, schema);
  return (
    Object.keys(object).filter(key => !(schema[key] && propertyMatchesSchema))
      .length < 1
  );
};

const createPropertyValidator = (object, schema) => key =>
  schema[key](object[key]);
