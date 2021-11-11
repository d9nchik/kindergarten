import React, { FunctionComponent, useState, useEffect } from 'react';
import Manager, { ShortOrganizerInfo } from '../../utils/manager';
import { Link } from 'react-router-dom';

interface IProps {
  user: Manager;
}

const AllOrganizers: FunctionComponent<IProps> = ({ user }: IProps) => {
  const [organizer, setOrganizer] = useState<ShortOrganizerInfo[]>([]);
  useEffect(() => {
    (async () => setOrganizer(await user.allOrganizers()))();
  }, [user]);

  return (
    <ul>
      {organizer.map(({ companyName, id }) => (
        <li key={`${companyName}${id}`}>
          <Link to={`/changeOrganizer/${id}`}>{companyName}</Link>
        </li>
      ))}
    </ul>
  );
};

export default AllOrganizers;
