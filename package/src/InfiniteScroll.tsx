import {ReactNode, useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import {ListOnItemsRenderedProps} from 'react-window';

type OnItemsRendered = (props: ListOnItemsRenderedProps) => unknown;
type Direction = 'start' | 'end';
type Props = {
  /** Return whether an item at the index has been loaded. */
  isItemLoaded: (index: number) => boolean;
  /**
   * Callback to load more items.
   * Receives a parameter `'start'` or `'end'` to load items at the start or end.
   */
  loadMoreItems: (direction: Direction) => Promise<unknown>;
  /**
   * Callback to be called when items have been rendered.
   * This prop is optional.
   */
  onItemsRendered?: OnItemsRendered;
  /** Returns the number of items. Can be arbitrary large if the total size is unknown. */
  itemCount: number;
  /**
   * Threshold value to load more items on items rendered.
   * When 1st ~ *threshold*th first item at either end is visible, `loadMoreItems` will be called.
   * Setting the value `0` or smaller may disable calling `loadMoreItems` on items rendered.
   */
  threshold: number;
  /**
   * offset value (in `px`) for smooth infinite scrolling.
   * Recommends value equal to minimum height of items or higher.
  */
  scrollOffset: number;
  /** children that receives `onItemsRendered` props and returns `ReactNode`. */
  children: ({onItemsRendered}: {onItemsRendered: OnItemsRendered}) => ReactNode;
  /** `ref` to the outer continer element. */
  outerRef: React.RefObject<HTMLElement>;
  /** *Actual* data that needs to be virtually scrolled.  */
  data: unknown[];
}

const InfiniteScroll = ({
  isItemLoaded,
  loadMoreItems,
  onItemsRendered,
  itemCount,
  threshold,
  scrollOffset,
  children,
  outerRef,
  data,
}: Props) => {
  /** To prevent call loadMoreItems redundantly, in both `onItemsRendered` and on data change. */
  const pending = useRef<boolean>(false);
  const prevHeight = useRef<number | null>(null);

  const _loadMoreItems = useCallback(async (direction: Direction) => {
    if (pending.current || !outerRef.current) {
      return;
    }
    pending.current = true;
    // Record previous height to scroll before browser repaint.
    if (direction === 'start') {
      prevHeight.current = outerRef.current.scrollHeight;
    }
    await loadMoreItems(direction);
    pending.current = false;
  }, [outerRef, loadMoreItems]);

  const _onItemsRendered = useCallback<OnItemsRendered>((args) => {
    const {visibleStartIndex, visibleStopIndex} = args;
    onItemsRendered?.(args);
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
  }, [data.length, threshold, itemCount, isItemLoaded, _loadMoreItems, onItemsRendered]);

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

  // Scroll downward to prevent calling loadMoreItems infinitely.
  // Do not pass deps argument as the effect should run with ref value.
  useLayoutEffect(() => {
    if (prevHeight.current === null || outerRef.current === null) {
      return;
    }
    outerRef.current.scrollTop = Math.max(
      outerRef.current.scrollHeight - prevHeight.current, scrollOffset
    );
    prevHeight.current = null;
  });

  return <>{children({onItemsRendered: _onItemsRendered})}</>;
};

export default InfiniteScroll;
