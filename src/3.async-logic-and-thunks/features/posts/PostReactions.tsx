import { useAppDispatch } from '@/2.app-structure-and-data-flow/app/hooks';
import { reactToPost, type IPost } from './postsSlice';
import type { CSSProperties } from 'react';

const reactionButtonStyle: CSSProperties = {
  padding: '8px',
};

const reactionButtons: Array<{
  label: string;
  emoji: string;
  reaction: keyof IPost['reactions'];
}> = [
  { label: 'Like', emoji: '👍', reaction: 'like' },
  { label: 'Love', emoji: '❤️', reaction: 'love' },
  { label: 'Wow', emoji: '😮', reaction: 'wow' },
];

type PostReactionsProps = {
  post: IPost;
};

function PostReactions({ post }: PostReactionsProps) {
  const dispatch = useAppDispatch();

  const handleReaction = (reaction: keyof IPost['reactions']) => {
    dispatch(reactToPost({ postId: post.id, reaction }));
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
      {reactionButtons.map(({ label, emoji, reaction }) => (
        <button
          key={reaction}
          onClick={() => handleReaction(reaction)}
          title={label}
          style={reactionButtonStyle}
        >
          {emoji}
          {post.reactions[reaction]}
        </button>
      ))}
    </div>
  );
}

export default PostReactions;
