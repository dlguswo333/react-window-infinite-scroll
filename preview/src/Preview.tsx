import InfiniteScroll from 'react-window-infinite-scroll';
import useReactWindow from './useReactWindow';
import {FixedSizeList} from 'react-window';
import {CSSProperties, useRef} from 'react';

const Preview = () => {
  const {data, loadMoreItems, isItemsLoaded, itemCount} = useReactWindow();
  const outerRef = useRef<HTMLElement>(null);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  return <>
    <InfiniteScroll
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
    </InfiniteScroll>
  </>;
};

export default Preview;
