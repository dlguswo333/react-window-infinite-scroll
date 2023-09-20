import {CSSProperties, useRef, useState} from 'react';
import InfiniteScroll from '../src/InfiniteScroll';
import {FixedSizeList} from 'react-window';
import React from 'react';

export const StaticData1 = () => {
  const data = ['0'];
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
  const data = ['0', '1', '2'];
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
  const [data, setData] = useState<string[]>(hasInitialData ? ['0'] : []);
  const outerRef = useRef<HTMLElement>(null);
  const loadMoreItemsSync = () => {
    setData(data.concat(data.length.toString()));
  };
  const loadMoreItemsAsync = async () => {
    if (howToLoad !== 'instantAsync') {
      await new Promise(res => setTimeout(res, howToLoad === 'fastAsync' ? 0 : 300));
    }
    setData(data.concat(data.length.toString()));
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
