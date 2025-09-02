import { useAppSelector } from '@/2.app-structure-and-data-flow/app/hooks';
import type { CSSProperties } from 'react';
import AuthorName from '../users/AuthorName';
import TimeAgo from './TimeAgo';
import PostReactions from './PostReactions';
import PostPopUp from './PostPopUp';

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

function PostsList() {
  const posts = useAppSelector((state) => state.posts);

  const renderedPosts = posts.map((post) => (
    <article key={post.id} style={articleStyle}>
      <div style={displayBetweenStyle}>
        <h3 style={{ margin: '4px 0' }}>{post.title}</h3>
        <PostPopUp post={post} />
      </div>
      <p style={{ margin: '6px 0' }}>{post.content}</p>
      <div style={displayBetweenStyle}>
        <AuthorName authorId={post.authorId} />
        <TimeAgo timestamp={post.publishedAt} />
      </div>
      <PostReactions post={post} />
    </article>
  ));

  return (
    <div style={containerStyle}>
      <h2>Posts</h2>
      {renderedPosts}
    </div>
  );
}

export default PostsList;
