import {
  useAppDispatch,
  useAppSelector,
} from '@/2.app-structure-and-data-flow/app/hooks';
import React from 'react';
import type { CSSProperties } from 'react';
import { addPost, editPost } from './postsSlice';

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
  const users = useAppSelector((store) => store.users);
  const postEdit = useAppSelector((store) => store.postEdit);
  const dispatch = useAppDispatch();

  const usersList = Object.values(users);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;

    if (title && content && authorId) {
      if (postEdit.post) {
        dispatch(editPost(postEdit.post.id, title, content, authorId));
      } else {
        dispatch(addPost(title, content, authorId));
      }
      formData.delete('title');
      formData.delete('content');
      formData.delete('authorId');
      e.currentTarget.reset();
    }
  };

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
      <select
        name="authorId"
        id=""
        defaultValue={postEdit.post?.authorId ?? ''}
      >
        <option value="">Select Author</option>
        {usersList.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Content"
        name="content"
        defaultValue={postEdit.post?.content ?? ''}
        style={{ height: '4rem' }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostForm;
