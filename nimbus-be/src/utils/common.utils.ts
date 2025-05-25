export const keysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => keysToCamelCase(item));
  }

  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const trimmedKey = key.replace(/^_+|_+$/g, "");
      const camelKey = trimmedKey.replace(/([-_][a-z])/gi, (c) =>
        c.toUpperCase().replace("-", "").replace("_", "")
      );
      result[camelKey] = keysToCamelCase(obj[key]);
      return result;
    }, {});
  }

  return obj;
};
