import './asset/Style.scss';
import InfiniteScroll from 'react-window-infinite-scroll';
import {FixedSizeList} from 'react-window';
import useReactWindow from './useReactWindow';
import {CSSProperties, useRef} from 'react';

const App = () => {
  const {data, loadMoreItems, isItemsLoaded, itemCount} = useReactWindow();
  const outerRef = useRef<HTMLElement>(null);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => (
    <div style={style}>{data[index]}</div>
  );

  return <>
    <header className='Preview-Header'>
      <h1>@dlguswo333/react-window-infinite-scroll preview</h1>
    </header>
    <main className='Preview-Main'>
      <InfiniteScroll
        data={data}
        loadMoreItems={loadMoreItems}
        isItemLoaded={isItemsLoaded}
        itemCount={itemCount}
        threshold={1}
        outerRef={outerRef}
      >
        {({onItemsRendered}) => <FixedSizeList
          height={500}
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
    </main>
  </>;
};

export default App;
