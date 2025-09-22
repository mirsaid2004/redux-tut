import {
  useReactToPostMutation,
  type IPost,
} from '../features/posts/postsSlice';
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
  const [reactToPost] = useReactToPostMutation();
  const handleReaction = (reaction: keyof IPost['reactions']) => {
    reactToPost({
      postId: post.id,
      reactions: {
        ...post.reactions,
        [reaction]: post.reactions[reaction] + 1,
      },
    });
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
      {reactionButtons.map(({ label, emoji, reaction }) => (
        <button
          key={reaction}
          onClick={() => handleReaction(reaction)}
          title={label}
          style={reactionButtonStyle}
          type="button"
        >
          {emoji}
          {post.reactions[reaction]}
        </button>
      ))}
    </div>
  );
}

export default PostReactions;
