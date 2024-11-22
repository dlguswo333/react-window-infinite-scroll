import InfiniteScroll from 'react-window-infinite-scroll';
import useReactWindow from './useReactWindow';
import {FixedSizeList} from 'react-window';
import {CSSProperties, useRef, useState} from 'react';
import Config, {Configs} from './Config';

const defaultValues = {
  numItemsToLoadAtOnce: 1,
  threshold: 1,
  scrollOffset: 30,
  infiniteScrollDirection: 'end',
} as const;

const Preview = () => {
  const [numItemsToLoadAtOnce, setNumItemsToLoadAtOnce] = useState<Configs['NumItemsToLoadAtOnce']>(defaultValues.numItemsToLoadAtOnce);
  const [threshold, setThreshold] = useState<Configs['Threshold']>(defaultValues.threshold);
  const [scrollOffset, setScrollOffset] = useState<Configs['ScrollOffset']>(defaultValues.scrollOffset);
  const [infiniteScrollDirection, setInfiniteScrollDirection] = useState<Configs['InfiniteScrollDirection']>(defaultValues.infiniteScrollDirection);
  const {data, loadMoreItems, isItemsLoaded, itemCount} = useReactWindow({numItemsToLoadAtOnce, infiniteScrollDirection});
  const outerRef = useRef<HTMLElement>(null);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  return <div>
    <Config
      numItemsToLoadAtOnce={numItemsToLoadAtOnce}
      threshold={threshold}
      scrollOffset={scrollOffset}
      infiniteScrollDirection={infiniteScrollDirection}
      setNumItemsToLoadAtOnce={setNumItemsToLoadAtOnce}
      setThreshold={setThreshold}
      setScrollOffset={setScrollOffset}
      setInfiniteScrollDirection={setInfiniteScrollDirection}
    />
    <InfiniteScroll
      data={data}
      loadMoreItems={loadMoreItems}
      isItemLoaded={isItemsLoaded}
      itemCount={itemCount}
      threshold={threshold}
      outerRef={outerRef}
      scrollOffset={scrollOffset}
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
    </InfiniteScroll>
  </div>;
};

export default Preview;
