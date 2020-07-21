export default {
  index: "/",
  timeline: "/:id"
};

export const pathNames = {
  index: "Index",
  timeline: "Timeline"
};

export const buildPath = (path, params) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  );
};
