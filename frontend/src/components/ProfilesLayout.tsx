import { Outlet } from 'react-router-dom';
import ProfilesActions from './ProfilesActions';

const ProfilesLayout = () => {
  return (
    <>
      <ProfilesActions />
      <Outlet />
    </>
  );
};

export default ProfilesLayout;