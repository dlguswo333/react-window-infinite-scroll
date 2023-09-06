import {CSSProperties, useRef} from 'react';
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
