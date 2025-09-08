import Intro from './1.redux-toolkit-intro';
import AppStructureAndDataFlow from './2.app-structure-and-data-flow';
import AsyncLogicAndThunks from './3.async-logic-and-thunks';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '50px',
        padding: '20px',
      }}
    >
      <Intro />
      <AppStructureAndDataFlow />
      <AsyncLogicAndThunks />
    </div>
  );
}

export default App;
