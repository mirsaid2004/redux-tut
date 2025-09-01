import { useAppDispatch } from '@/2.app-structure-and-data-flow/app/hooks';
import { reactToPost, type IPostState } from './postsSlice';

function PostReactions({ postId }: { postId: string }) {
  const dispatch = useAppDispatch();

  const handleReaction = (reaction: keyof IPostState['reactions']) => {
    dispatch(reactToPost({ postId, reaction }));
  };

  return (
    <div>
      <button onClick={() => handleReaction('like')} title="Like">
        {' '}
        👍
      </button>
      <button onClick={() => handleReaction('love')} title="Love">
        {' '}
        ❤️
      </button>
      <button onClick={() => handleReaction('wow')} title="Wow">
        {' '}
        😮
      </button>
    </div>
  );
}

export default PostReactions;
