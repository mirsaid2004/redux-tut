import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Intro from '@/1.redux-toolkit-intro';
import AppStructureAndDataFlow from '@/2.app-structure-and-data-flow';
import AsyncLogicAndThunks from '@/3.async-logic-and-thunks';
import BlogProject from '@/4.blog-project';
import PostsList from '@/4.blog-project/pages/Posts.page';
import PostCreate from '@/4.blog-project/pages/PostCreate.page';
import PostEdit from '@/4.blog-project/pages/PostEdit.page';
import Post from '@/4.blog-project/pages/Post.page';
import Lesson from './components/Lesson';

import './App.css';

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
        <Route path="blog-project" element={<BlogProject />}>
          <Route index element={<PostsList />} />
          <Route path="create-post" element={<PostCreate />} />
          <Route path="edit-post/:postId" element={<PostEdit />} />
          <Route path="post/:postId" element={<Post />} />
        </Route>
      </Route>
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
