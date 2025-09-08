import { useEffect, type CSSProperties } from 'react';
import AuthorName from '../users/AuthorName';
import TimeAgo from './TimeAgo';
import PostReactions from './PostReactions';
import PostPopUp from './PostPopUp';
import {
  fetchPosts,
  getPostsError,
  getPostsStatus,
  type IPost,
} from './postsSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '@/3.async-logic-and-thunks/app/hooks';

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
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
};

function PostsList() {
  const posts = useAppSelector((state) => state.postsData.posts);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);
  const dispatch = useAppDispatch();

  const sortPostsByTime = (a: (typeof posts)[0], b: (typeof posts)[0]) =>
    b.publishedAt.localeCompare(a.publishedAt);
  const sortedPosts = posts?.slice().sort(sortPostsByTime);

  console.log({ posts });

  useEffect(() => {
    const data = fetchPosts();
    dispatch(data);
  }, [dispatch]);

  let content;
  if (postsStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (postsStatus === 'succeeded') {
    content = sortedPosts?.map((post) => (
      <PostItem key={post.id} post={post} />
    ));
  } else if (postsStatus === 'failed') {
    content = <p>{postsError}</p>;
  }

  return (
    <div style={containerStyle}>
      <h2>Posts</h2>
      {content}
    </div>
  );
}

const PostItem = ({ post }: { post: IPost }) => {
  return (
    <article key={post.id} style={articleStyle}>
      <div style={displayBetweenStyle}>
        <h3 style={postTitleStyle}>{post.title}</h3>
        <PostPopUp post={post} />
      </div>
      <p style={{ margin: '6px 0' }}>{post.content}</p>
      <div style={displayBetweenStyle}>
        <AuthorName authorId={post.authorId} />
        <TimeAgo timestamp={post.publishedAt} />
      </div>
      <PostReactions post={post} />
    </article>
  );
};

export default PostsList;
