import User, { SERVER_URL } from './user';

interface AddEventProps {
  eventTypeID: number;
  userOrganizerID: number;
  name: string;
  date: number;
  startTime: string;
  endTime: string | null;
  price: number;
  minParticipantsCount: number;
  detailedInfo: string | null;
}

interface EventType {
  id: number;
  name: string;
}

// Organizer maybe extends parent
class Organizer extends User {
  public async getEventsTypes(): Promise<EventType[]> {
    const response = await fetch(`${SERVER_URL}/organizer/eventTypes`, {
      headers: { Authorization: this.jwt_token },
    });
    const data = (await response.json()) as EventType[];
    return data;
  }

  public async updateOrganizer(event: AddEventProps): Promise<boolean> {
    const response = await fetch(`${SERVER_URL}/organizer/addEvent`, {
      headers: {
        Authorization: this.jwt_token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(event),
    });
    return response.ok;
  }
}

export default Organizer;
