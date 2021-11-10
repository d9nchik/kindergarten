import React, { FunctionComponent } from 'react';
import { user } from '../utils/facade';
import Organizer from './organizer/Organizer';
import Manager from './manager/Manager';
import User from './user/User';

const ChooseRole: FunctionComponent = () => {
  if (user.isManager()) return <Manager />;
  if (user.isOrganizer()) return <Organizer />;
  return <User />;
};

export default ChooseRole;
