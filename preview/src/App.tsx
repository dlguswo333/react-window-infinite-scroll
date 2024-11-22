import './asset/Style.scss';
import Preview from './Preview';

const App = () => {
  return <>
    <header className='Preview-Header'>
      <h1>react-window-infinite-scroll preview</h1>
    </header>
    <main className='Preview-Main'>
      <Preview />
      <Preview />
      <Preview />
    </main>
  </>;
};

export default App;
