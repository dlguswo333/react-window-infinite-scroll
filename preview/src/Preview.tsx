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
  const [layout, setLayout] = useState<Configs['Layout']>('vertical');
  const {data, loadMoreItems, isItemsLoaded, itemCount, resetData} = useReactWindow({numItemsToLoadAtOnce, infiniteScrollDirection});
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
      layout={layout}
      setNumItemsToLoadAtOnce={setNumItemsToLoadAtOnce}
      setThreshold={setThreshold}
      setScrollOffset={setScrollOffset}
      setInfiniteScrollDirection={setInfiniteScrollDirection}
      setLayout={setLayout}
      resetData={resetData}
    />
    <InfiniteScroll
      data={data}
      loadMoreItems={loadMoreItems}
      isItemLoaded={isItemsLoaded}
      itemCount={itemCount}
      threshold={threshold}
      outerRef={outerRef}
      scrollOffset={scrollOffset}
      layout={layout}
    >
      {({onItemsRendered}) => <FixedSizeList
        height={layout === 'vertical' ? 300 : 100}
        itemCount={itemCount}
        width={layout === 'vertical' ? '100%' : 600}
        onItemsRendered={onItemsRendered}
        itemSize={layout === 'vertical' ? 30 : 60}
        outerRef={outerRef}
        className='Outer'
        layout={layout}
      >
        {Row}
      </FixedSizeList>}
    </InfiniteScroll>
  </div>;
};

export default Preview;
