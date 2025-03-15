import {useCallback, useMemo, useRef, useState} from 'react';
import {sleep} from './util';
import {Configs} from './Config';

const MAX_LENGTH = 500;
const SLEEP_MS = 100;

type Props = {
  numItemsToLoadAtOnce: Configs['NumItemsToLoadAtOnce'];
  infiniteScrollDirection: Configs['InfiniteScrollDirection'],
}

const useReactWindow = ({
  numItemsToLoadAtOnce,
  infiniteScrollDirection,
}: Props) => {
  const [data, setData] = useState<string[]>(() => ['<0>']);
  const resetData = useCallback(() => setData(['<0>']), []);
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
    const getNewItems = () => {
      if (data.length >= MAX_LENGTH) {
        // This must not be reached.
        throw Error(`data length exceeds MAX_LENGTH:${MAX_LENGTH}`);
      }
      const newItems = [];
      const start = direction === 'end'
        ? Number(/(-?\d+)/.exec(data[data.length - 1])![1]) + 1 
        : Number(/(-?\d+)/.exec(data[0])![1]) - numItemsToLoadAtOnce;
      for (let i = 0;i < numItemsToLoadAtOnce;++i) {
        newItems.push(`<${start + i}>`);
      }
      return direction === 'end' 
        ? [...data, ...newItems]
        : [...newItems, ...data];
    };
    await sleep(SLEEP_MS);
    setData(getNewItems());
    isFetching.current = false;
  }, [data, numItemsToLoadAtOnce]);

  const isItemsLoaded = useCallback((index: number) => {
    switch (infiniteScrollDirection) {
    case 'end':
      return data.length >= MAX_LENGTH || index < 0;
    case 'both':
      return data.length >= MAX_LENGTH;
    case 'start':
      return data.length >= MAX_LENGTH || index >= 0;
    }
  }, [data.length, infiniteScrollDirection]);

  return {
    data, loadMoreItems, isItemsLoaded, itemCount, resetData,
  };
};

export default useReactWindow;
