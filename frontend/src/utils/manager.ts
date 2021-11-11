import User, { SERVER_URL } from './user';

export interface EventProps {
  id: number;
  name: string;
  date: number;
  startTime: string;
  endTime: string | null;
  price: number;
  minParticipantsCount: number;
  detailedInfo: string | null;
}
export interface ShortOrganizerInfo {
  id: number;
  companyName: string;
}

export interface OrganizerInformation {
  organizerID: number;
  name: string;
  address: string;
  phone_number: string;
  site?: string;
  mail: string;
  detailed_info?: string;
}

class Manager extends User {
  public async notifyParents(): Promise<boolean> {
    return true;
  }

  public async getNotSelectedEvents(): Promise<EventProps[]> {
    const response = await fetch(`${SERVER_URL}/manager/notSelectedEvents`, {
      headers: {
        Authorization: this.jwt_token,
      },
    });
    const data = (await response.json()) as EventProps[];
    return data;
  }

  public async addEventToFutureEvents(eventID: number): Promise<boolean> {
    const url = new URL(`${SERVER_URL}/manager/selectEvent`);
    url.searchParams.append('eventID', eventID.toString());
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: this.jwt_token,
      },
    });
    return response.ok;
  }

  public async updateOrganizer(
    organizerDetail: OrganizerInformation,
  ): Promise<boolean> {
    const response = await fetch(`${SERVER_URL}/manager/updateOrganizer`, {
      headers: {
        Authorization: this.jwt_token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(organizerDetail),
    });
    return response.ok;
  }

  public async getOrganizer(
    organizerID: number,
  ): Promise<OrganizerInformation> {
    const url = new URL(`${SERVER_URL}/manager/organizer`);
    url.searchParams.append('organizerID', organizerID.toString());
    const response = await fetch(url.toString(), {
      headers: { Authorization: this.jwt_token },
    });
    const data = await response.json();
    return data;
  }

  public async allOrganizers(): Promise<ShortOrganizerInfo[]> {
    const response = await fetch(`${SERVER_URL}/manager/allOrganizers`, {
      headers: { Authorization: this.jwt_token },
    });
    const data = await response.json();
    return data;
  }
  public async selectEvent(eventID: number): Promise<boolean> {
    const url = new URL(`${SERVER_URL}/manager/selectEvent`);
    url.searchParams.append('eventID', eventID.toString());
    const response = await fetch(url.toString(), {
      headers: { Authorization: this.jwt_token },
    });

    return response.ok;
  }
}

export default Manager;
