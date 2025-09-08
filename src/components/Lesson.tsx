import BackButton from './BackButton';
import { Outlet } from 'react-router';

function Lesson() {
  return (
    <div>
      <BackButton />
      <Outlet />
    </div>
  );
}

export default Lesson;
