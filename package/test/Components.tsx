import {CSSProperties, useEffect, useRef, useState} from 'react';
import InfiniteScroll from '../src/InfiniteScroll';
import {FixedSizeList} from 'react-window';
import React from 'react';

// This is to access data value from playwright test context.
// Refer https://playwright.dev/docs/evaluating/
declare global {
  interface Window {
    data: unknown[];
  }
}

export const StaticData1 = () => {
  const data = ['<0>'];
  const outerRef = useRef<HTMLElement>(null);
  const loadMoreItems = () => new Promise(res => res(undefined));
  const isItemsLoaded = () => true;
  const itemCount = data.length;

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );
  return <InfiniteScroll
    data={data}
    loadMoreItems={loadMoreItems}
    isItemLoaded={isItemsLoaded}
    itemCount={itemCount}
    threshold={1}
    outerRef={outerRef}
    scrollOffset={30}
  >
    {({onItemsRendered}) => <FixedSizeList
      height={300}
      itemCount={itemCount}
      width='100%'
      onItemsRendered={onItemsRendered}
      itemSize={30}
      outerRef={outerRef}
      className='Outer'
    >
      {Row}
    </FixedSizeList>}
  </InfiniteScroll>;
};

export const StaticData2 = () => {
  const data = ['<0>', '<1>', '<2>'];
  const outerRef = useRef<HTMLElement>(null);
  const loadMoreItems = () => new Promise(res => res(undefined));
  const isItemsLoaded = () => true;
  const itemCount = data.length;

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );
  return <InfiniteScroll
    data={data}
    loadMoreItems={loadMoreItems}
    isItemLoaded={isItemsLoaded}
    itemCount={itemCount}
    threshold={1}
    outerRef={outerRef}
    scrollOffset={30}
  >
    {({onItemsRendered}) => <FixedSizeList
      height={300}
      itemCount={itemCount}
      width='100%'
      onItemsRendered={onItemsRendered}
      itemSize={30}
      outerRef={outerRef}
      className='Outer'
    >
      {Row}
    </FixedSizeList>}
  </InfiniteScroll>;
};


/**
 * It will show 10 items at once since the container has height of 300 and each item of 30.
 */
export const SimpleDynamicData = ({hasInitialData, howToLoad, longerData}: {hasInitialData: boolean; howToLoad: 'sync' | 'instantAsync' | 'fastAsync' | 'slowAsync', longerData: boolean;}) => {
  const maxDataSize = longerData ? 100 : 3;
  const [data, setData] = useState<string[]>(hasInitialData ? ['<0>'] : []);
  const outerRef = useRef<HTMLElement>(null);
  const loadMoreItemsSync = () => {
    setData(data.concat(`<${data.length.toString()}>`));
  };
  const loadMoreItemsAsync = async () => {
    if (howToLoad !== 'instantAsync') {
      await new Promise(res => setTimeout(res, howToLoad === 'fastAsync' ? 0 : 300));
    }
    setData(data.concat(`<${data.length.toString()}>`));
  };
  const isItemsLoaded = (index: number) => {
    const ret = !(index === data.length && index < maxDataSize);
    return ret;
  };
  const itemCount = data.length + (data.length < maxDataSize ? 1 : 0);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  return <InfiniteScroll
    data={data}
    loadMoreItems={howToLoad === 'sync' ? loadMoreItemsSync : loadMoreItemsAsync}
    isItemLoaded={isItemsLoaded}
    itemCount={itemCount}
    threshold={1}
    outerRef={outerRef}
    scrollOffset={30}
  >
    {({onItemsRendered}) => <FixedSizeList
      height={300}
      itemCount={itemCount}
      width='100%'
      onItemsRendered={onItemsRendered}
      itemSize={30}
      outerRef={outerRef}
      className='Outer'
    >
      {Row}
    </FixedSizeList>}
  </InfiniteScroll>;
};

/**
 * It will show 10 items at once since the container has height of 300 and each item of 30.
 */
export const BiDirectDynamicData = ({hasInitialData, howToLoad}: {hasInitialData: boolean; howToLoad: 'sync' | 'instantAsync' | 'fastAsync' | 'slowAsync'}) => {
  const maxDataSize = 100;
  const [data, setData] = useState<string[]>(hasInitialData ? ['<0>'] : []);
  const outerRef = useRef<HTMLElement>(null);
  const getNewData = (direction: 'start' | 'end') => (
    direction === 'start' ?
      [`<${Number(data[0].replace(/[<>]/g, '')) - 1}>`, ...data] :
      [...data, data.length === 0 ? '<0>' : `<${Number(data[data.length - 1].replace(/[<>]/g, '')) + 1}>`]
  );
  const loadMoreItemsSync = (direction: 'start' | 'end') => {
    setData(getNewData(direction));
  };
  const loadMoreItemsAsync = async (direction: 'start' | 'end') => {
    if (howToLoad !== 'instantAsync') {
      await new Promise(res => setTimeout(res, howToLoad === 'fastAsync' ? 0 : 500));
    }
    setData(getNewData(direction));
  };
  const isItemsLoaded = (index: number) => {
    const ret = !(index < maxDataSize && (index === -1 || index === data.length));
    return ret;
  };
  const itemCount = data.length + (data.length < maxDataSize ? 1 : 0);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  useEffect(() => {
    window.data = data;
  }, [data]);

  return <InfiniteScroll
    data={data}
    loadMoreItems={howToLoad === 'sync' ? loadMoreItemsSync : loadMoreItemsAsync}
    isItemLoaded={isItemsLoaded}
    itemCount={itemCount}
    threshold={1}
    outerRef={outerRef}
    scrollOffset={40}
  >
    {({onItemsRendered}) => <FixedSizeList
      height={300}
      itemCount={itemCount}
      width='100%'
      onItemsRendered={onItemsRendered}
      itemSize={30}
      outerRef={outerRef}
      className='Outer'
    >
      {Row}
    </FixedSizeList>}
  </InfiniteScroll>;
};

/**
 * Loading data fails for the first period.
 * This is to test infinite rerender bug.
 * https://github.com/dlguswo333/react-window-infinite-scroll/issues/21
 */
export const SomeFailDynamicData = ({hasInitialData, howToLoad}: {hasInitialData: boolean; howToLoad: 'sync' | 'async';}) => {
  const maxDataSize = 100;
  const [data, setData] = useState<string[]>(hasInitialData ? ['<0>'] : []);
  const outerRef = useRef<HTMLElement>(null);
  const loadMoreItemsSync = () => {
    if (!shouldUpdateData) {
      return;
    }
    setData(data.concat(`<${data.length.toString()}>`));
  };
  const [shouldUpdateData, setShouldUpdateData] = useState(false);
  const loadMoreItemsAsync = async () => {
    if (!shouldUpdateData) {
      return;
    }
    setData(data.concat(`<${data.length.toString()}>`));
  };

  useEffect(() => {
    (async () => {
      await new Promise((res) => setTimeout(res, 500));
      setShouldUpdateData(true);
    })();
  }, []);

  const isItemsLoaded = (index: number) => {
    const ret = !(index === data.length && index < maxDataSize);
    return ret;
  };
  const itemCount = data.length + (data.length < maxDataSize ? 1 : 0);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  return <InfiniteScroll
    data={data}
    loadMoreItems={howToLoad === 'sync' ? loadMoreItemsSync : loadMoreItemsAsync}
    isItemLoaded={isItemsLoaded}
    itemCount={itemCount}
    threshold={1}
    outerRef={outerRef}
    scrollOffset={30}
  >
    {({onItemsRendered}) => <FixedSizeList
      height={300}
      itemCount={itemCount}
      width='100%'
      onItemsRendered={onItemsRendered}
      itemSize={30}
      outerRef={outerRef}
      className='Outer'
    >
      {Row}
    </FixedSizeList>}
  </InfiniteScroll>;
};

/**
 * Should load more data even if `threshold` is 0, thanks to positive `scrollOffset`.
 */
export const ThresholdZeroBiDirectDynamicData = () => {
  const maxDataSize = 100;
  const [data, setData] = useState<string[]>(['<0>']);
  const outerRef = useRef<HTMLElement>(null);
  const getNewData = (direction: 'start' | 'end') => (
    direction === 'start' ?
      [`<${Number(data[0].replace(/[<>]/g, '')) - 1}>`, ...data] :
      [...data, data.length === 0 ? '<0>' : `<${Number(data[data.length - 1].replace(/[<>]/g, '')) + 1}>`]
  );
  const loadMoreItemsAsync = async (direction: 'start' | 'end') => {
    await new Promise(res => setTimeout(res, 0));
    setData(getNewData(direction));
  };
  const isItemsLoaded = (index: number) => {
    const ret = !(index < maxDataSize && (index === -1 || index === data.length));
    return ret;
  };
  const itemCount = data.length + (data.length < maxDataSize ? 1 : 0);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  useEffect(() => {
    window.data = data;
  }, [data]);

  return <InfiniteScroll
    data={data}
    loadMoreItems={loadMoreItemsAsync}
    isItemLoaded={isItemsLoaded}
    itemCount={itemCount}
    threshold={0}
    outerRef={outerRef}
    scrollOffset={40}
  >
    {({onItemsRendered}) => <FixedSizeList
      height={300}
      itemCount={itemCount}
      width='100%'
      onItemsRendered={onItemsRendered}
      itemSize={30}
      outerRef={outerRef}
      className='Outer'
    >
      {Row}
    </FixedSizeList>}
  </InfiniteScroll>;
};
