import { type CSSProperties } from 'react';
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
  const orderedPostIds = useAppSelector(selectPostIds);
  const { isLoading, isError, isSuccess, error } = useGetPostsQuery();

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
      <p style={postContentStyle}>{post.content}</p>
      <Link to={`post/${post.id}`}>View Post</Link>
      <div style={displayBetweenStyle}>
        <AuthorName authorId={post.authorId} />
        <TimeAgo timestamp={post.publishedAt} />
      </div>
      <PostReactions post={post} />
    </article>
  );
};

export default PostsList;
