import React, { FunctionComponent } from 'react';
import { user } from '../utils/facade';
import Organizer from './organizer/Organizer';
import Manager from './manager/Manager';
import Parent from './parent/Parent';

const ChooseRole: FunctionComponent = () => {
  if (user.isManager()) return <Manager />;
  if (user.isOrganizer()) return <Organizer />;
  return <Parent />;
};

export default ChooseRole;
