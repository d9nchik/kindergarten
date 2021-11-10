import User, { SERVER_URL } from './user';

interface AddEventProps {
  eventTypeID: number;
  name: string;
  date: number;
  startTime: string;
  endTime?: string;
  price: number;
  minParticipantsCount: number;
  detailedInfo?: string;
}

export interface EventType {
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

  public async addEvent(event: AddEventProps): Promise<boolean> {
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
