import {ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ListOnItemsRenderedProps} from 'react-window';
import {getElementData, isPromise} from './util';

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
   * Setting the value `0` or smaller might disable calling `loadMoreItems` on items rendered.
   */
  threshold: number;
  /**
   * offset value (in `px`) for smooth infinite scrolling.
   * Recommends value equal to minimum length of items or higher.
  */
  scrollOffset: number;
  /** children that receives `onItemsRendered` props and returns `ReactNode`. */
  children: ({onItemsRendered}: {onItemsRendered: OnItemsRendered}) => ReactNode;
  /** `ref` to the outer continer element. Passing the HTML element directly is also permitted. */
  outerRef: React.RefObject<HTMLElement> | HTMLElement;
  /** *Actual* data that needs to be virtually scrolled. */
  data: unknown[];
  /** Layout of the virtual list. Default is `'vertical'`. */
  layout?: 'vertical' | 'horizontal';
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
  layout = 'vertical',
}: Props) => {
  /** To prevent call loadMoreItems redundantly, in both `onItemsRendered` and on data change. */
  const pending = useRef<boolean>(false);
  const prevLength = useRef<number | null>(null);
  /** A dummy state to trigger rerender when promises by `loadMoreItems` resolves. */
  const [dummyState, setDummyState] = useState(0);
  const forceRerender = () => setDummyState(pre => pre + 1);
  const prevData = useRef<typeof data>(data);
  const [shouldCheckDataChange, setShouldCheckDataChange] = useState<boolean>(false);
  /**
   * Prevent calling `loadMoreItems` frequently when loading items at the start.
   * However, do this only if enough items are loaded that
   * the `outerRef`'s scrollLength is large enough to scroll the element.
   */
  const shouldBlockLoadMoreItems = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    const {clientLength, scrollLength} = getElementData(outerElement, layout);
    const loadedEnoughItems = clientLength + scrollOffset < scrollLength;
    if (shouldBlockLoadMoreItems.current !== null && loadedEnoughItems) {
      return;
    }
    pending.current = true;
    // Record previous length to scroll before browser repaint.
    if (direction === 'start') {
      prevLength.current = scrollLength;
    }
    const ret = loadMoreItems(direction);
    if (isPromise(ret)) {
      await ret;
      setShouldCheckDataChange(true);
    }
    pending.current = false;
  }, [getOuterElement, loadMoreItems, scrollOffset, layout]);

  const _onItemsRendered = useCallback<OnItemsRendered>((args) => {
    const {visibleStartIndex, visibleStopIndex} = args;
    onItemsRendered?.(args);
    if (data.length === itemCount) {
      // All items are loaded and visible.
      return;
    }
    if (
      visibleStopIndex >= data.length - threshold &&
      !isItemLoaded(data.length)
    ) {
      // Last 'threshold' items are visible.
      _loadMoreItems('end');
    } else if (
      (visibleStartIndex <= threshold - 1 || visibleStartIndex === 0) &&
      !isItemLoaded(-1)
    ) {
      // First 'threshold' items are visible.
      _loadMoreItems('start');
    }
  }, [data.length, threshold, itemCount, isItemLoaded, _loadMoreItems, onItemsRendered]);

  // Force rerender only if the data has just been changed.
  // This is to prevent the following bugs.
  // - loadMoreItems function does not run even if it needs to.
  // - Force rerender logics cause an infinite rerender loop.
  // https://github.com/dlguswo333/react-window-infinite-scroll/issues/21
  useEffect(() => {
    if (!shouldCheckDataChange) {
      return;
    }
    setShouldCheckDataChange(false);
    if (prevData.current !== data) {
      prevData.current = data;
      forceRerender();
    }
  }, [data, shouldCheckDataChange]);

  // Call loadMoreItems when data changes to fetch data enough to fill the screen
  // without user having to scroll to induce onItemsRendered callback.
  useEffect(() => {
    const outerElement = getOuterElement();
    if (!outerElement) {
      return;
    }
    const element = outerElement;
    const {scrollStart, offsetLength, scrollLength} = getElementData(element, layout);
    const isAtEnd = scrollStart + offsetLength + scrollOffset > scrollLength;
    const isAtStart = scrollStart < scrollOffset;
    if (isAtEnd && !isItemLoaded(data.length)) {
      // Scrolled to end.
      _loadMoreItems('end');
    } else if (isAtStart && !isItemLoaded(-1)) {
      // Scrolled to start.
      _loadMoreItems('start');
    }
  }, [data, dummyState, isItemLoaded, itemCount, scrollOffset, layout, _loadMoreItems, getOuterElement]);

  // Scroll downward to prevent calling loadMoreItems infinitely.
  // Do not pass deps argument as the effect should run with ref value.
  // Since it checks `prevLength`, the function will execute only after loadMoreItems('start') is called.
  useLayoutEffect(() => {
    const set = () => {
      shouldBlockLoadMoreItems.current = setTimeout(() => {
        shouldBlockLoadMoreItems.current = null;
      }, TIMEOUT_INTERVAL);
    };
    const reset = () => {
      if (shouldBlockLoadMoreItems.current !== null) {
        clearTimeout(shouldBlockLoadMoreItems.current);
      }
    };
    const outerElement = getOuterElement();

    if (prevLength.current === null || outerElement === null) {
      if (shouldBlockLoadMoreItems.current !== null) {
        // Set the flag only when the flag is truthy
        // to gurantee to load more items at 'start' for the first time.
        set();
      }
      return reset;
    }

    if (layout === 'vertical') {
      outerElement.scrollTop = Math.max(
        outerElement.scrollHeight - prevLength.current, scrollOffset
      );
    } else {
      outerElement.scrollLeft = Math.max(
        outerElement.scrollWidth - prevLength.current, scrollOffset
      );
    }
    prevLength.current = null;

    set();
    return reset;
  });

  return <>{children({onItemsRendered: _onItemsRendered})}</>;
};

export default InfiniteScroll;
