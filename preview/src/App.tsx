import './asset/Style.scss';
import InfiniteScroll from 'react-window-infinite-scroll';

const App = () => {
  return <>
    <header className='Preview-Header'>
      <h1>@dlguswo333/react-window-infinite-scroll preview</h1>
    </header>
    <main className='Preview-Main'>
      <InfiniteScroll />
    </main>
  </>;
};

export default App;
