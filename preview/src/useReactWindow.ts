import {useCallback, useMemo, useRef, useState} from 'react';
import {sleep} from './util';

const MAX_LENGTH = 500;
const SLEEP_MS = 10;

const useReactWindow = () => {
  const [data, setData] = useState<string[]>([]);
  const isFetching = useRef<boolean>(false);
  const itemCount = useMemo(() => data.length + (data.length < MAX_LENGTH ? 1 : 0), [data.length]);

  const loadMoreItems = useCallback(async () => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    await sleep(SLEEP_MS);
    setData(data => {
      if (data.length >= MAX_LENGTH) {
        // This must not be reached.
        throw Error(`data length exceeds MAX_LENGTH:${MAX_LENGTH}`);
      }
      const newData = `data ${data.length}`;
      return data.concat([newData]);
    });
    isFetching.current = false;
  }, []);

  const isItemsLoaded = useCallback((index: number) => {
    return index >= MAX_LENGTH || index < data.length;
  }, [data.length]);

  return {
    data, loadMoreItems, isItemsLoaded, itemCount
  };
};

export default useReactWindow;
