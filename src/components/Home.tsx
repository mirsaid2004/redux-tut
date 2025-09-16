import { Link } from 'react-router-dom';
// image imports
import ReduxToolkitIntro from '@/assets/redux-toolkit-intro.png';
import AppStructureAndDataFlow from '@/assets/app-structure-and-data-flow.png';
import AsyncLogicAndThunks from '@/assets/async-logic-and-thunks.png';
import BlogProject from '@/assets/blog-page.png';
import PerformanceOptimizations from '@/assets/performance-optimizations.png';
import RTKQueryIntro from '@/assets/rtk-query-intro.png';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  {
    path: '/lesson/rtk-query-intro',
    title: '6. RTK Query Intro',
    description:
      'Learn how to use RTK Query for data fetching and caching in Redux.',
    img: RTKQueryIntro,
    alt: 'RTK Query Intro',
  },
];

const isNum = (value: number | null): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

const goUp = (index: number | null) => {
  if (isNum(index) && index - 3 >= 0) return index - 3;
  return index;
};

const goDown = (index: number | null) => {
  if (isNum(index) && index + 3 < lesson_pages.length) return index + 3;
  return index;
};

const goRight = (index: number | null) => {
  if (isNum(index) && index + 1 < lesson_pages.length) return index + 1;
  return index;
};

const goLeft = (index: number | null) => {
  if (isNum(index) && index - 1 >= 0) return index - 1;
  return index;
};

function Home() {
  const [focusIndex, setFocusIndex] = useState<number | null>(0);
  const indexRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    console.log(e.key);
    switch (e.key) {
      case 'ArrowDown': {
        setFocusIndex((currentIndex) => {
          const nextIndex = goDown(currentIndex);
          indexRefs.current[nextIndex ?? 0]?.focus();
          return nextIndex;
        });
        break;
      }
      case 'ArrowUp': {
        setFocusIndex((currentIndex) => {
          const nextIndex = goUp(currentIndex);
          indexRefs.current[nextIndex ?? 0]?.focus();
          return nextIndex;
        });
        break;
      }
      case 'ArrowRight': {
        setFocusIndex((currentIndex) => {
          const nextIndex = goRight(currentIndex);
          indexRefs.current[nextIndex ?? 0]?.focus();
          return nextIndex;
        });
        break;
      }
      case 'ArrowLeft': {
        setFocusIndex((currentIndex) => {
          const nextIndex = goLeft(currentIndex);
          indexRefs.current[nextIndex ?? 0]?.focus();
          return nextIndex;
        });
        break;
      }
    }
  }, []);

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      // Map the native event to a shape compatible with handleKeyDown
      // Only pass the key property since that's all that's used
      handleKeyDown({ key: e.key } as React.KeyboardEvent<HTMLElement>);
    };
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [handleKeyDown]);

  console.log(focusIndex);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Redux Lessons</h1>
      <div className="lesson_wrapper_style">
        {lesson_pages.map((lesson, index) => (
          <Link
            to={lesson.path}
            key={index}
            tabIndex={index}
            aria-selected={focusIndex === index}
            ref={(el) => {
              indexRefs.current[index] = el;
            }}
            onMouseOver={() => setFocusIndex(index)}
            className={`lesson_link_style ${
              index === focusIndex ? 'focused' : ''
            }`}
          >
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <img src={lesson.img} alt={lesson.alt} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
