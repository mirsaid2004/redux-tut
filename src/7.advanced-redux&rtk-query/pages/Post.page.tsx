import { type CSSProperties } from 'react';
import AuthorName from '../components/AuthorName';
import PostPopUp from '../components/PostPopUp';
import PostReactions from '../components/PostReactions';
import TimeAgo from '../components/TimeAgo';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectPostById } from '../features/posts/postsSlice';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const articleStyle: CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '10px',
  margin: '10px auto',
  maxWidth: '600px',
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
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
};

const postContentStyle: CSSProperties = {
  margin: '6px 0',
};

function PostPage() {
  const param = useParams();
  const post = useAppSelector((state) => selectPostById(state, param.postId!));

  if (!post) {
    return (
      <section style={containerStyle}>
        <h2>Post not found</h2>
      </section>
    );
  }

  return (
    <article key={post.id} style={articleStyle}>
      <div style={displayBetweenStyle}>
        <h3 style={postTitleStyle}>{post.title}</h3>
        <PostPopUp post={post} />
      </div>
      <p style={postContentStyle}>{post.body}</p>
      <div style={displayBetweenStyle}>
        <AuthorName authorId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </div>
      <PostReactions post={post} />
    </article>
  );
}

export default PostPage;
