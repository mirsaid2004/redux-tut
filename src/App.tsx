import { Routes, Route } from 'react-router';
import Home from './components/Home';
import Intro from '@/1.redux-toolkit-intro';
import AppStructureAndDataFlow from '@/2.app-structure-and-data-flow';
import AsyncLogicAndThunks from '@/3.async-logic-and-thunks';
import BlogProject from '@/4.blog-project';
import './App.css';
import Lesson from './components/Lesson';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="lesson" element={<Lesson />}>
        <Route path="redux-toolkit-intro" element={<Intro />} />
        <Route
          path="app-structure-and-data-flow"
          element={<AppStructureAndDataFlow />}
        />
        <Route
          path="async-logic-and-thunks"
          element={<AsyncLogicAndThunks />}
        />
        <Route path="blog-project" element={<BlogProject />} />
      </Route>
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
