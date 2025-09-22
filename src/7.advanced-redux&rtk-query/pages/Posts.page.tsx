import { memo, useEffect, useRef, type CSSProperties } from 'react';
import AuthorName from '../components/AuthorName';
import TimeAgo from '../components/TimeAgo';
import PostReactions from '../components/PostReactions';
import {
  useGetPostsQuery,
  selectPostById,
  selectPostIds,
} from '../features/posts/postsSlice';
import { useAppSelector } from '@/7.advanced-redux&rtk-query/app/hooks';
import { Link } from 'react-router';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const articleStyle: CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '10px',
  margin: '10px 0',
  maxWidth: '400px',
  width: '100%',
};

const displayBetweenStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '12px',
};

const postTitleStyle: CSSProperties = {
  margin: '4px 0',
};

const postContentStyle: CSSProperties = {
  margin: '6px 0',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
};

function PostsList() {
  const { isLoading, isError, isSuccess, error } = useGetPostsQuery(undefined, {
    selectFromResult(state) {
      return {
        isLoading: state.isLoading,
        isError: state.isError,
        isSuccess: state.isSuccess,
        error: state.error,
      };
    },
  });
  const orderedPostIds = useAppSelector(selectPostIds);

  // Debug: track PostsList re-renders
  const renderCount = useRef(0);
  const prevPostIds = useRef(orderedPostIds);
  const prevQueryState = useRef({ isLoading });
  console.log({ isLoading });

  renderCount.current++;

  useEffect(() => {
    console.log(`🔄 PostsList re-render #${renderCount.current}`);

    if (prevPostIds.current !== orderedPostIds) {
      console.log('❌ orderedPostIds reference changed!');
      console.log('Previous:', prevPostIds.current);
      console.log('Current:', orderedPostIds);
      console.log(
        'Arrays equal?',
        JSON.stringify(prevPostIds.current) === JSON.stringify(orderedPostIds),
      );
    } else {
      console.log('✅ orderedPostIds reference is the same');
    }

    const currentQueryState = { isLoading };
    if (
      JSON.stringify(prevQueryState.current) !==
      JSON.stringify(currentQueryState)
    ) {
      console.log('❌ Query state changed!');
      console.log('Previous query state:', prevQueryState.current);
      console.log('Current query state:', currentQueryState);
    } else {
      console.log('✅ Query state is the same');
    }

    prevPostIds.current = orderedPostIds;
    prevQueryState.current = currentQueryState;
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = orderedPostIds?.map((post) => (
      <PostItem key={post} postId={post} />
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return (
    <div style={containerStyle}>
      <h2>Posts</h2>
      {content}
    </div>
  );
}

const PostItem = ({ postId }: { postId: string }) => {
  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) return null;

  return (
    <article key={post.id} style={articleStyle}>
      <div style={displayBetweenStyle}>
        <h3 style={postTitleStyle}>{post.title}</h3>
      </div>
      <p style={postContentStyle}>{post.body}</p>
      <Link to={`post/${post.id}`}>View Post</Link>
      <div style={displayBetweenStyle}>
        <AuthorName authorId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </div>
      <PostReactions post={post} />
    </article>
  );
};

export default memo(PostsList);
