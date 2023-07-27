import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {ListOnItemsRenderedProps} from 'react-window';

type OnItemsRendered = (props: ListOnItemsRenderedProps) => unknown;
type Direction = 'start' | 'end';
type Props = {
  isItemLoaded: (index: number) => boolean;
  loadMoreItems: (direction: Direction) => Promise<unknown>;
  itemCount: number;
  threshold: number;
  /** offset value for smooth infinite scrolling. */
  scrollOffset: number;
  children: ({onItemsRendered}: {onItemsRendered: OnItemsRendered}) => ReactNode;
  outerRef: React.RefObject<HTMLElement>;
  data: unknown[];
}

const InfiniteScroll = ({
  isItemLoaded,
  loadMoreItems,
  itemCount,
  threshold,
  scrollOffset,
  children,
  outerRef,
  data,
}: Props) => {
  /** To prevent call loadMoreItems redundantly, in both `onItemsRendered` and data change event. */
  const pending = useRef<boolean>(false);
  const _loadMoreItems = useCallback(async (direction: Direction) => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    await loadMoreItems(direction);
    pending.current = false;
  }, [loadMoreItems]);

  const onItemsRendered = useCallback<OnItemsRendered>(({visibleStartIndex, visibleStopIndex}) => {
    if (data.length === itemCount) {
      // All items are loaded and visible.
      return;
    }
    if (visibleStopIndex >= data.length - threshold) {
      // Last 'threshold' items are visible.
      if (isItemLoaded(data.length)) {
        return;
      }
      _loadMoreItems('end');
    } else if (visibleStartIndex <= threshold - 1) {
      // First 'threshold' items are visible.
      if (isItemLoaded(-1)) {
        return;
      }
      _loadMoreItems('start');
    }
  }, [data.length, threshold, itemCount, isItemLoaded, _loadMoreItems]);

  // Call loadMoreItems when data changes to fetch data enough to fill the screen
  // without user having to scroll to induce onItemsRendered callback.
  useEffect(() => {
    if (!outerRef.current) {
      return;
    }
    const element = outerRef.current;
    if (element.scrollTop + element.offsetHeight + scrollOffset >= element.scrollHeight) {
      // Scrolled to bottom.
      if (isItemLoaded(data.length)) {
        return;
      }
      _loadMoreItems('end');
    } else if (element.scrollTop <= scrollOffset) {
      // Scrolled to top.
      if (isItemLoaded(-1)) {
        return;
      }
      _loadMoreItems('start');
    }
  }, [data, isItemLoaded, itemCount, scrollOffset, _loadMoreItems, outerRef]);

  return <>{children({onItemsRendered})}</>;
};

export default InfiniteScroll;
