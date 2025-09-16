import { Link } from 'react-router-dom';
// image imports
import ReduxToolkitIntro from '@/assets/redux-toolkit-intro.png';
import AppStructureAndDataFlow from '@/assets/app-structure-and-data-flow.png';
import AsyncLogicAndThunks from '@/assets/async-logic-and-thunks.png';
import BlogProject from '@/assets/blog-page.png';
import PerformanceOptimizations from '@/assets/performance-optimizations.png';

const lesson_pages = [
  {
    path: '/lesson/redux-toolkit-intro',
    title: '1. Redux Toolkit Intro',
    description:
      'Learn the basics of Redux Toolkit and how it simplifies Redux development.',
    img: ReduxToolkitIntro,
    alt: 'Redux Toolkit Intro',
  },
  {
    path: '/lesson/app-structure-and-data-flow',
    title: '2. App Structure and Data Flow',
    description:
      'Understand the structure of a Redux application and how data flows through it.',
    img: AppStructureAndDataFlow,
    alt: 'App Structure and Data Flow',
  },
  {
    path: '/lesson/async-logic-and-thunks',
    title: '3. Async Logic and Thunks',
    description:
      'Learn how to handle asynchronous logic in Redux using Thunks.',
    img: AsyncLogicAndThunks,
    alt: 'Async Logic and Thunks',
  },
  {
    path: '/lesson/blog-project',
    title: '4. Blog Project',
    description: 'Build a blog application using Redux Toolkit.',
    img: BlogProject,
    alt: 'Blog Project',
  },
  {
    path: '/lesson/performance-optimizations',
    title: '5. Performance Optimizations',
    description:
      'Learn how to optimize the performance of your Redux application.',
    img: PerformanceOptimizations,
    alt: 'Performance Optimizations',
  },
];

function Home() {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Redux Lessons</h1>
      <div className="lesson_wrapper_style">
        {lesson_pages.map((lesson) => (
          <Link
            to={lesson.path}
            key={lesson.path}
            className="lesson_link_style"
          >
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <img src={lesson.img} alt={lesson.alt} />
          </Link>
        ))}
      </div>
    </>
  );
}

export default Home;
