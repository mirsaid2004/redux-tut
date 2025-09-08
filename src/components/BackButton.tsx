import { useNavigate } from 'react-router';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleBack}>
      <span style={{ marginRight: '8px' }}>←</span> Back
    </button>
  );
}

export default BackButton;
