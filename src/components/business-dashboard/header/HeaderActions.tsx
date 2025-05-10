
import React from 'react';
import POSButton from './POSButton';
import ClockInOutButton from './ClockInOutButton';
import CalculatorPopover from '../calculator/CalculatorPopover';
import UserProfileMenu from './UserProfileMenu';

const HeaderActions = () => {
  return (
    <div className="ml-auto flex items-center gap-1 sm:gap-2">
      <POSButton />
      <CalculatorPopover />
      <ClockInOutButton />
      <UserProfileMenu />
    </div>
  );
};

export default HeaderActions;
