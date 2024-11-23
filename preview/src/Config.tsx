export type Configs = {
  NumItemsToLoadAtOnce: 1 | 3 | 5;
  Threshold: number,
  ScrollOffset: number,
  InfiniteScrollDirection: 'start' | 'end' | 'both',
}
type SetState<T> = React.Dispatch<React.SetStateAction<T>>

type Props = {
  numItemsToLoadAtOnce: Configs['NumItemsToLoadAtOnce'];
  threshold: Configs['Threshold'],
  scrollOffset: Configs['ScrollOffset'],
  infiniteScrollDirection: Configs['InfiniteScrollDirection'],
  setNumItemsToLoadAtOnce: SetState<Configs['NumItemsToLoadAtOnce']>;
  setThreshold: SetState<Configs['Threshold']>,
  setScrollOffset: SetState<Configs['ScrollOffset']>,
  setInfiniteScrollDirection: SetState<Configs['InfiniteScrollDirection']>,
  resetData: () => void;
}

const Config = ({
  numItemsToLoadAtOnce,
  threshold,
  scrollOffset,
  infiniteScrollDirection,
  setNumItemsToLoadAtOnce,
  setThreshold,
  setScrollOffset,
  setInfiniteScrollDirection,
  resetData,
}: Props) => {
  return <div className='Preview-Config'>
    <div>
      <h3>Number of Items to Load At Once: <code>{numItemsToLoadAtOnce}</code></h3>
      <select
        value={numItemsToLoadAtOnce}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value === 1 || value === 3 || value === 5) {
            setNumItemsToLoadAtOnce(value);
          }
        }}
      >
        <option value={1}>1</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
      </select>
    </div>
    <div>
      <h3>threshold: <code>{threshold}</code></h3>
      <input type='number' defaultValue={threshold} onChange={(e) => {
        const value = Number(e.target.value);
        if (Number.isInteger(value) && 0 <= value && value <= 5) {
          setThreshold(value);
        }
      }} />
      (<code>0</code> ~ <code>5</code>)
    </div>
    <div>
      <h3>Infinite Scroll Direction: <code>{infiniteScrollDirection}</code></h3>
      <select
        value={infiniteScrollDirection}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'start' || value === 'end' || value === 'both') {
            setInfiniteScrollDirection(value);
          }
        }}
      >
        <option value='start'>start</option>
        <option value='end'>end</option>
        <option value='both'>both</option>
      </select>
    </div>
    <div>
      <h3>Scroll Offset: <code>{scrollOffset}</code></h3>
      <input type='number' defaultValue={scrollOffset} onChange={(e) => {
        const value = Number(e.target.value);
        if (Number.isInteger(value) && 0 <= value && value <= 30) {
          setScrollOffset(value);
        }
      }} />
      (<code>0</code> ~ <code>30</code>)
    </div>
    <div>
      <h3>Reset Data</h3>
      <button onClick={resetData}>reset</button>
    </div>
  </div>;
};

export default Config;
