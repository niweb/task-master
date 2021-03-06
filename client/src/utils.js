/**
 * Find contrast color for text on colored background
 */
export const getContrastColor = color => {
  if (color.indexOf("#") === 0) {
    color = color.slice(1);
  }
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  if (color.length !== 6) {
    throw new Error("Invalid HEX color.");
  }

  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
};

/**
 * Generate a new id, that is not yet assigned
 */
export const generateNewId = currentIds => {
  const ids = currentIds.map(id => Number(id));
  const maxId = Math.max(...ids);
  return ids.length > 0 ? maxId + 1 : 0;
};

/** =========================
 *  Date Handling
 *  =========================
 */
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const isBusinessDay = date => date.isoWeekday() < 6;

export const getBusinessDaysBetween = (start, end) => {
  const range = moment.range(start, end).by("day");
  return Array.from(range)
    .map(d => d.startOf("d"))
    .filter(isBusinessDay);
};

export const addBusinessDays = (date, days) => {
  date = moment(date);
  let absoluteDays = Math.abs(days);
  const increment = days / absoluteDays;
  while (absoluteDays > 0) {
    date = date.add(increment, "d");
    if (isBusinessDay(date)) {
      absoluteDays -= 1;
    }
  }
  return date;
};

/** =========================
 *  Validating Object Schemas
 *  =========================
 */
export const isType = type => value => typeof value === type;
export const isInstance = type => value => value instanceof type;
export const isNull = value => value === null;
export const isArrayOf = type => value =>
  typeof value === "object" && value.map(isType(type));

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
