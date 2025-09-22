import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useAppSelector } from '@/7.advanced-redux&rtk-query/app/hooks';
import { selectAllUsers } from '../features/users/usersSlice';

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

type PostFormProps = {
  defaultValues?: {
    title?: string;
    body?: string;
    userId?: string;
  };
  formTitle: string;
  handleSubmitForm: (
    e: React.FormEvent<HTMLFormElement>,
    setFormStatus: (requestStatus: FormRequestStatus) => void,
  ) => void;
};

export type FormRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

function PostForm({
  defaultValues,
  formTitle,
  handleSubmitForm,
}: PostFormProps) {
  const [formRequestStatus, setFormRequestStatus] =
    useState<FormRequestStatus>('idle');
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const authorRef = useRef<HTMLSelectElement>(null);
  const users = useAppSelector(selectAllUsers);
  const usersList = Object.values(users);

  const shouldDisableForm = formRequestStatus === 'loading';

  const changeFormStatus = (status: FormRequestStatus) => {
    setFormRequestStatus(status);
  };

  console.log({ defaultValues });

  useEffect(() => {
    if (titleRef.current && defaultValues?.title) {
      titleRef.current.value = defaultValues.title;
    }
    if (contentRef.current && defaultValues?.body) {
      contentRef.current.value = defaultValues.body;
    }
    if (authorRef.current && defaultValues?.userId) {
      authorRef.current.value = defaultValues.userId;
    }
  }, [defaultValues]);

  return (
    <form
      onSubmit={(e) => handleSubmitForm(e, changeFormStatus)}
      style={formStyle}
    >
      <h3 style={{ margin: '8px 0' }}>{formTitle}</h3>
      <input
        type="text"
        placeholder="Title"
        name="title"
        defaultValue={defaultValues?.title ?? ''}
        style={{ height: '2rem' }}
      />
      {usersList.length ? (
        <select name="authorId" defaultValue={defaultValues?.userId ?? '0'}>
          <option value="0">Select User</option>
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
        defaultValue={defaultValues?.body ?? ''}
        style={{ height: '4rem' }}
      />
      <button type="submit" disabled={shouldDisableForm}>
        Submit
      </button>
    </form>
  );
}

export default PostForm;
