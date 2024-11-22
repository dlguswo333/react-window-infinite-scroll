import './asset/Style.scss';
import Preview from './Preview';
import GithubIcon from './asset/GithubIcon.svg';
import NpmIcon from './asset/NpmIcon.svg';

const App = () => {
  return <>
    <header className='Preview-Header'>
      <h1>react-window-infinite-scroll preview</h1>
      <div className='Icons'>
        <a
          className='IconLink'
          href='https://github.com/dlguswo333/react-window-infinite-scroll'>
          <img src={GithubIcon} />
        </a>
        <a
          className='IconLink'
          href='https://www.npmjs.com/package/react-window-infinite-scroll'>
          <img src={NpmIcon} />
        </a>
      </div>
    </header>
    <main className='Preview-Main'>
      <Preview />
      <Preview />
      <Preview />
    </main>
  </>;
};

export default App;
