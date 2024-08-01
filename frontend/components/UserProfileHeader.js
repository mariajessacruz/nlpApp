// components/UserProfileHeader.js
import React from 'react';
import Logo from './Logo';

const UserProfileHeader = ({ user }) => {
  return (
    <header className="w-full py-4 px-8 bg-[#F8FFED] flex justify-between items-center">
      <Logo size="small" />
      <div className="flex items-center">
        <div className="mr-4 text-green-700">
          {user.email}
        </div>
        <img src={user.user_metadata?.avatar_url || '/default-avatar.png'} alt="User" className="w-10 h-10 rounded-full" />
      </div>
    </header>
  );
};

export default UserProfileHeader;
