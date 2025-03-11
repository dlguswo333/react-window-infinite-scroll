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

export const getElementData = (element: HTMLElement, layout: 'vertical' | 'horizontal') => {
  const scrollStart = layout === 'vertical' ? element.scrollTop : element.scrollLeft;
  const clientLength = layout === 'vertical' ? element.clientHeight : element.clientWidth;
  const offsetLength = layout === 'vertical' ? element.offsetHeight : element.offsetWidth;
  const scrollLength = layout === 'vertical' ? element.scrollHeight : element.scrollWidth;
  return {
    scrollStart,
    clientLength,
    offsetLength,
    scrollLength,
  };
};
