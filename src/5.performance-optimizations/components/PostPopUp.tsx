import { useAppDispatch } from '@/5.performance-optimizations/app/hooks';
import { useState, useRef, useEffect } from 'react';
import { deletePostFromApi, type IPost } from '../features/posts/postsSlice';
import { Link, useNavigate } from 'react-router';

type PostPopUpProps = {
  post: IPost;
};

function PostPopUp({ post }: PostPopUpProps) {
  const [openPopUp, setOpenPopUp] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenPopUp(false);
      }
    }
    if (openPopUp) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openPopUp]);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        onClick={() => setOpenPopUp(true)}
        disabled={openPopUp}
        style={{ padding: '8px', cursor: 'pointer', fontSize: '12px' }}
      >
        {openPopUp ? '▲' : '▼'}
      </button>
      {openPopUp && (
        <div
          ref={modalRef}
          style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            background: '#333',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '16px',
            zIndex: 100,
            minWidth: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Link to={'/lesson/performance-optimizations/edit-post/' + post.id}>
            <button style={{ marginRight: '8px', width: '100%' }}>Edit</button>
          </Link>
          <button
            onClick={() => {
              dispatch(deletePostFromApi(post.id));
              navigate('/lesson/performance-optimizations');
            }}
            style={{ color: 'red' }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default PostPopUp;
