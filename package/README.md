# react-window-infinite-scroll
react-window-infinite-scroll is a infinite scroll library
specifically designed for [react-window][react-window].

# Why react-window-infinite-scroll?
react-window-infinite-scroll is to reliably load more items even when the following conditions hold:
- `loadMoreItems` callback might cancel fetching more items.
- There are not enough initial items to fill the scrollable element, thereby noway to induce `onItemsRendered` callback.
- Not only do you need to scroll infinitely to the end, but also to the top.

# Props (Properties)
```ts
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
  /** *Actual* data that needs to be virtually scrolled. */
  data: unknown[];
}
```

# How to Use
Here is a simple example where you can do infinite scroll with react-window-infinite-scroll.
```tsx
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
```

# FAQ
## In which case `loadMoreitems` might cancel loading more items?
In some cases, where `loadMoreItems` API author does not like to call the API too frequently,
he/she might add a conditional statement.
The reasons for this may vary, from improving browser performance to preventing server overload.

The following is an example code where `loadMoreItems` might cancel fetching more items.

```ts
const loadMoreItems = () => {
  if(isFetchingAlready) {
    return;
  }
  isFetchingAlready = true;
  fetchItems();
  isFetchingAlready = false;
}
```

In this case, some infinite scrolling packages do not work due to the blocking.
However, with react-window-infinite-scroll, we try our best to mitigate the problem,
by subscribing to data changes and item rendered events.

## Why `scrollOffset` prop is not optional?
`scrollOffset` shall not be optional since it is crucial to load more items.
With it being optional, infinite scroll could have not load more items when the outer element's height
and the inner element's height is almost equal, `onItemsRendered` is not likely to be called,
but scrollOffset is too small to load more items.

That is why we recommend you set the value as big as the minimum height of items being rendered.

## Why use both `onItemsRendered` and data change events?
This is to load items reliably.
When many rows are loaded at once,
data change events would most likely not to load more items
since the scrollbar is not near the bottom or the top.
Later on, when you scroll the component, `onItemsRendered` will fire and load more items in that case.

In another case, when you have as many rows as the component is barely filled,
`onItemsRendered` would most likely not to fire,
(Especially when you have big `overscanCount` prop value of `react-window`.)
even when you have tiny scrollable height.
Data change event will load more items in that case.

# Development


[react-window]: https://github.com/bvaughn/react-window
