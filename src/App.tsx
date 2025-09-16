import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Intro from '@/1.redux-toolkit-intro';
import AppStructureAndDataFlow from '@/2.app-structure-and-data-flow';
import AsyncLogicAndThunks from '@/3.async-logic-and-thunks';
// 4.blog-project imports
import BlogProject from '@/4.blog-project';
import PostsList from '@/4.blog-project/pages/Posts.page';
import PostCreate from '@/4.blog-project/pages/PostCreate.page';
import PostEdit from '@/4.blog-project/pages/PostEdit.page';
import Post from '@/4.blog-project/pages/Post.page';
// 5.performance-optimizations imports
import PerformanceOptimizations from '@/5.performance-optimizations';
import PerformancePostsList from '@/5.performance-optimizations/pages/Posts.page';
import PerformanceUsersList from '@/5.performance-optimizations/pages/UsersList.page';
import PerformancePostCreate from '@/5.performance-optimizations/pages/PostCreate.page';
import PerformancePostEdit from '@/5.performance-optimizations/pages/PostEdit.page';
import PerformancePost from '@/5.performance-optimizations/pages/Post.page';
import PerformanceUser from '@/5.performance-optimizations/pages/User.page';
// Lesson wrapper
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
        <Route
          path="performance-optimizations"
          element={<PerformanceOptimizations />}
        >
          <Route index element={<PerformancePostsList />} />
          <Route path="users" element={<PerformanceUsersList />} />
          <Route path="users/:userId" element={<PerformanceUser />} />
          <Route path="create-post" element={<PerformancePostCreate />} />
          <Route path="edit-post/:postId" element={<PerformancePostEdit />} />
          <Route path="post/:postId" element={<PerformancePost />} />
        </Route>
      </Route>
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
