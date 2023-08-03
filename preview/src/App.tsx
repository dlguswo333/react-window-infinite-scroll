import './asset/Style.scss';
import Preview from './Preview';

const App = () => {
  return <>
    <header className='Preview-Header'>
      <h1>react-window-infinite-scroll preview</h1>
    </header>
    <main className='Preview-Main'>
      <Preview type={1} />
      <Preview type={2} />
      <Preview type={3} />
    </main>
  </>;
};

export default App;
