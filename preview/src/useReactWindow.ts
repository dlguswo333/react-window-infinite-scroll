import {useCallback, useMemo, useRef, useState} from 'react';
import {sleep} from './util';

const MAX_LENGTH = 500;
const SLEEP_MS = 100;

const useReactWindow = (type: 1 | 2) => {
  const [data, setData] = useState<string[]>(type === 1 ? [] : ['data 150']);
  const isFetching = useRef<boolean>(false);
  const itemCount = useMemo(() => data.length + (data.length < MAX_LENGTH ? 1 : 0), [data.length]);

  /**
   * Intentionally depend on `data` state to test
   * if `loadMoreItems` can add new items without duplicated items.
   */
  const loadMoreItems = useCallback(async (direction: 'start' | 'end') => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    switch (type) {
    case 1: {
      const newValue = `data ${data.length}`;
      await sleep(SLEEP_MS);
      setData(data => {
        if (data.length >= MAX_LENGTH) {
        // This must not be reached.
          throw Error(`data length exceeds MAX_LENGTH:${MAX_LENGTH}`);
        }
        return data.concat([newValue]);
      });
      isFetching.current = false;
      break;
    }
    case 2: {
      const newValue = direction === 'end' ?
        `data ${Number(/(-?\d+)/.exec(data[data.length - 1])![1]) + 1}` :
        `data ${Number(/(-?\d+)/.exec(data[0])![1]) - 1}`;
      await sleep(SLEEP_MS);
      setData(data => {
        if (data.length >= MAX_LENGTH) {
        // This must not be reached.
          throw Error(`data length exceeds MAX_LENGTH:${MAX_LENGTH}`);
        }
        return direction === 'end' ? [...data, newValue] : [newValue, ...data];
      });
      isFetching.current = false;
      break;
    }
    }
  }, [data, type]);

  const isItemsLoaded = useCallback((index: number) => {
    switch (type) {
    case 1:
      return index >= MAX_LENGTH || index < data.length;
    case 2:
      return data.length >= MAX_LENGTH;
    }
  }, [data.length, type]);

  return {
    data, loadMoreItems, isItemsLoaded, itemCount,
  };
};

export default useReactWindow;
