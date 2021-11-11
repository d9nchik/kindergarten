import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import Manager from '../../utils/manager';

interface IProps {
  user: Manager;
}

const ChangeOrganizer: FunctionComponent<IProps> = ({ user }: IProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [site, setSite] = useState<string | undefined>();
  const [mail, setMail] = useState('');
  const [detailed_info, setDetailedInfo] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const { name, address, phone_number, site, mail, detailed_info } =
        await user.getOrganizer(Number(id));
      setName(name);
      setAddress(address);
      setPhoneNumber(phone_number);
      setSite(site);
      setMail(mail);
      setDetailedInfo(detailed_info);
    })();
  }, [user, id]);

  if (!id) {
    return <Navigate to={{ pathname: '/' }} />;
  }

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            if (
              await user.updateOrganizer({
                name,
                address,
                phone_number,
                mail,
                site: site ? site : undefined,
                detailed_info: detailed_info ? detailed_info : undefined,
                organizerID: Number(id),
              })
            )
              navigate('/allOrganizers');
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <label>
          Name:
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
        <br />
        <label>
          Phone Number:
          <input
            type="tel"
            required
            value={phone_number}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </label>
        <br />
        <label>
          Site:
          <input
            type="url"
            maxLength={20}
            value={site ? site : ''}
            onChange={(event) => setSite(event.target.value)}
          />
        </label>
        <br />
        <label>
          Mail:
          <input
            type="email"
            value={mail}
            required
            onChange={(event) => setMail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Detailed Info:
          <textarea
            value={detailed_info ? detailed_info : ''}
            onChange={(event) => setDetailedInfo(event.target.value)}
          />
        </label>
        <br />
        <input type="submit" />
      </form>
    </div>
  );
};

export default ChangeOrganizer;
