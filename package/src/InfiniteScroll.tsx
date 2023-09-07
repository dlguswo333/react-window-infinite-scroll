import {ReactNode, useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import {ListOnItemsRenderedProps} from 'react-window';
import {isPromise} from './util';

type OnItemsRendered = (props: ListOnItemsRenderedProps) => unknown;
type Direction = 'start' | 'end';
// [NOTE] Make sure to update README!
type Props = {
  /** Return whether an item at the index has been loaded. */
  isItemLoaded: (index: number) => boolean;
  /**
   * Callback to load more items.
   * Receives a parameter `'start'` or `'end'` to load items at the start or end.
   */
  loadMoreItems: (direction: Direction) => Promise<unknown> | unknown;
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
  /** `ref` to the outer continer element. Passing the HTML element directly is also permitted. */
  outerRef: React.RefObject<HTMLElement> | HTMLElement;
  /** *Actual* data that needs to be virtually scrolled. */
  data: unknown[];
}

/** This is arbitrary number thus subject to change. */
const TIMEOUT_INTERVAL = 5;

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
  /**
   * Prevent calling `loadMoreItems` frequently when loading items at the start.
   * However, do this only if enough items are loaded that
   * the `outerRef`'s scrollHeight is large enough to scroll the element.
   */
  const shouldBlockLoadMoreItems = useRef<number | null>(null);
  const getOuterElement = useCallback(() =>
    !outerRef ?
      null :
      'current' in outerRef ? outerRef.current : outerRef,
  [outerRef]);

  const _loadMoreItems = useCallback(async (direction: Direction) => {
    const outerElement = getOuterElement();
    if (pending.current || !outerElement) {
      return;
    }
    const loadedEnoughItems = outerElement.clientHeight + scrollOffset < outerElement.scrollHeight;
    if (shouldBlockLoadMoreItems.current !== null && loadedEnoughItems) {
      return;
    }
    pending.current = true;
    // Record previous height to scroll before browser repaint.
    if (direction === 'start') {
      prevHeight.current = outerElement.scrollHeight;
    }
    const ret = loadMoreItems(direction);
    if (isPromise(ret)) {
      await ret;
    }
    pending.current = false;
  }, [getOuterElement, loadMoreItems, scrollOffset]);

  const _onItemsRendered = useCallback<OnItemsRendered>((args) => {
    const {visibleStartIndex, visibleStopIndex} = args;
    onItemsRendered?.(args);
    if (data.length === itemCount) {
      // All items are loaded and visible.
      return;
    }
    if (visibleStopIndex >= data.length - threshold && !isItemLoaded(data.length)) {
      // Last 'threshold' items are visible.
      _loadMoreItems('end');
    } else if (visibleStartIndex <= threshold - 1 && !isItemLoaded(-1)) {
      // First 'threshold' items are visible.
      _loadMoreItems('start');
    }
  }, [data.length, threshold, itemCount, isItemLoaded, _loadMoreItems, onItemsRendered]);

  // Call loadMoreItems when data changes to fetch data enough to fill the screen
  // without user having to scroll to induce onItemsRendered callback.
  useEffect(() => {
    const outerElement = getOuterElement();
    if (!outerElement) {
      return;
    }
    const element = outerElement;
    const isAtBottom = element.scrollTop + element.offsetHeight + scrollOffset >= element.scrollHeight;
    const isAtTop = element.scrollTop <= scrollOffset;
    if (isAtBottom && !isItemLoaded(data.length)) {
      // Scrolled to bottom.
      _loadMoreItems('end');
    } else if (isAtTop && !isItemLoaded(-1)) {
      // Scrolled to top.
      _loadMoreItems('start');
    }
  }, [data, isItemLoaded, itemCount, scrollOffset, _loadMoreItems, getOuterElement]);

  // Scroll downward to prevent calling loadMoreItems infinitely.
  // Do not pass deps argument as the effect should run with ref value.
  // Since it checks `prevHeight`, the function will execute only after loadMoreItems('start') is called.
  useLayoutEffect(() => {
    const outerElement = getOuterElement();
    if (prevHeight.current === null || outerElement === null) {
      return;
    }
    outerElement.scrollTop = Math.max(
      outerElement.scrollHeight - prevHeight.current, scrollOffset
    );
    prevHeight.current = null;

    shouldBlockLoadMoreItems.current = setTimeout(() => {
      shouldBlockLoadMoreItems.current = null;
    }, TIMEOUT_INTERVAL);
    return () => {
      if (shouldBlockLoadMoreItems.current !== null) {
        clearTimeout(shouldBlockLoadMoreItems.current);
      }
    };
  });

  return <>{children({onItemsRendered: _onItemsRendered})}</>;
};

export default InfiniteScroll;
