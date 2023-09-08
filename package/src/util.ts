export const isPromise = (param: unknown): param is Promise<unknown> => {
  if (!param) {
    return false;
  }
  const convertedParam = param as Promise<unknown>;
  if (typeof convertedParam.then === 'function') {
    return true;
  }
  return false;
};
