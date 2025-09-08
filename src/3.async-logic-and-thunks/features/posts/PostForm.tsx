import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { addNewPost, updatePost } from './postsSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '@/3.async-logic-and-thunks/app/hooks';

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  maxWidth: '400px',
  width: '100%',
};

function PostForm() {
  const [formRequestStatus, setFormRequestStatus] = useState<
    'idle' | 'loading' | 'succeeded' | 'failed'
  >('idle');
  const users = useAppSelector((store) => store.users);
  const usersSelectRef = React.useRef<HTMLSelectElement>(null);
  const postEdit = useAppSelector((store) => store.postEdit);
  const dispatch = useAppDispatch();
  const usersList = Object.values(users);

  useEffect(() => {
    if (usersSelectRef.current && postEdit.post) {
      usersSelectRef.current.value = postEdit.post.authorId ?? '0';
    }
  }, [postEdit]);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFormRequestStatus('loading');

      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const authorId = formData.get('authorId') as string;

      if (title && content && authorId) {
        if (postEdit.post) {
          dispatch(
            updatePost({
              id: +postEdit.post.id,
              title,
              body: content,
              userId: +authorId,
            }),
          ).unwrap();
        } else {
          dispatch(
            addNewPost({ title, body: content, userId: +authorId }),
          ).unwrap();
        }
        formData.delete('title');
        formData.delete('content');
        formData.delete('authorId');
        e.currentTarget.reset();
      }

      setFormRequestStatus('succeeded');
    } catch (error) {
      console.error('Failed to submit form:', error);
      setFormRequestStatus('failed');
    } finally {
      setFormRequestStatus('idle');
    }
  };

  const shouldDisableForm = formRequestStatus === 'loading';

  console.log({ postEdit, usersList }, postEdit.post?.authorId);

  return (
    <form onSubmit={handleSubmitForm} style={formStyle}>
      <h3>Create Post</h3>
      <input
        type="text"
        placeholder="Title"
        name="title"
        defaultValue={postEdit.post?.title ?? ''}
        style={{ height: '2rem' }}
      />
      {usersList.length ? (
        <select
          ref={usersSelectRef}
          name="authorId"
          defaultValue={postEdit.post?.authorId ?? '0'}
        >
          <option value="0">Select Author</option>
          {usersList.map((user) => (
            <option key={user.id} value={user.id.toString()}>
              {user.name}
            </option>
          ))}
        </select>
      ) : (
        <p>No authors available</p>
      )}
      <textarea
        placeholder="Content"
        name="content"
        defaultValue={postEdit.post?.content ?? ''}
        style={{ height: '4rem' }}
      />
      <button type="submit" disabled={shouldDisableForm}>
        Submit
      </button>
    </form>
  );
}

export default PostForm;
