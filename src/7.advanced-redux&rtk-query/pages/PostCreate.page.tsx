import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import PostForm, { type FormRequestStatus } from '../components/PostForm';
import { addNewPost } from '../features/posts/postsSlice';

function PostCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handelSubmitForm = (
    e: React.FormEvent<HTMLFormElement>,
    setFormStatus: (requestStatus: FormRequestStatus) => void,
  ) => {
    e.preventDefault();
    try {
      setFormStatus('loading');

      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const authorId = formData.get('authorId') as string;

      if (title && content && authorId) {
        dispatch(
          addNewPost({ title, body: content, userId: +authorId }),
        ).unwrap();

        formData.delete('title');
        formData.delete('content');
        formData.delete('authorId');
        navigate(-1);
      }

      setFormStatus('succeeded');
    } catch (error) {
      console.error('Failed to submit form:', error);
      setFormStatus('failed');
    } finally {
      setFormStatus('idle');
    }
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
    >
      <PostForm formTitle={'Edit Post'} handleSubmitForm={handelSubmitForm} />
    </div>
  );
}

export default PostCreatePage;
