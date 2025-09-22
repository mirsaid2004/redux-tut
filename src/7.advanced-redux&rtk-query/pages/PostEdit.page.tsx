import { useNavigate, useParams } from 'react-router-dom';
import {
  selectPostById,
  useUpdatePostMutation,
} from '../features/posts/postsSlice';
import PostForm, { type FormRequestStatus } from '../components/PostForm';
import { useAppSelector } from '../app/hooks';

function PostEditPage() {
  const [updatePost] = useUpdatePostMutation();
  const params = useParams();
  const navigate = useNavigate();
  const postDetails = useAppSelector((state) =>
    selectPostById(state, params.postId!),
  );

  const handelSubmitForm = async (
    e: React.FormEvent<HTMLFormElement>,
    setFormStatus: (requestStatus: FormRequestStatus) => void,
  ) => {
    e.preventDefault();
    try {
      setFormStatus('loading');

      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const body = formData.get('content') as string;
      const userId = formData.get('authorId') as string;

      if (title && body && userId && postDetails) {
        await updatePost({
          id: postDetails.id,
          title,
          body,
          userId,
        }).unwrap();

        formData.delete('title');
        formData.delete('content');
        formData.delete('authorId');
        navigate(`/lesson/advanced-redux-and-rtk-query/post/${postDetails.id}`);
      }

      setFormStatus('succeeded');
    } catch (error) {
      console.error('Failed to submit form:', error);
      setFormStatus('failed');
    } finally {
      setFormStatus('idle');
    }
  };

  let content: React.ReactNode = <div>Not Found.</div>;

  if (postDetails) {
    content = (
      <PostForm
        defaultValues={postDetails}
        formTitle={'Create Post'}
        handleSubmitForm={handelSubmitForm}
      />
    );
  }

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
    >
      {content}
    </div>
  );
}

export default PostEditPage;
