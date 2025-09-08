import { useAppDispatch } from '@/2.app-structure-and-data-flow/app/hooks';
import { useState, useRef, useEffect } from 'react';
import { startEditing } from './postEditSlice';
import { deletePostFromApi, type IPost } from './postsSlice';

type PostPopUpProps = {
  post: IPost;
};

function PostPopUp({ post }: PostPopUpProps) {
  const [openPopUp, setOpenPopUp] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

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
          <button
            onClick={() => {
              dispatch(startEditing(post));
            }}
            style={{ marginRight: '8px', width: '100%' }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              dispatch(deletePostFromApi(post.id));
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
