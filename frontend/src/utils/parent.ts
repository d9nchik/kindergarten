import User, { SERVER_URL } from './user';
import { getSponsorEvents } from './chainOfResponsibility';

export interface Event {
  name: string;
  id: number;
  price: number;
  date: string;
  start_time: string;
  end_time: string;
  min_participants_count: number;
  detailed_info: string;
  user_joined: number;
}

class Parent extends User {
  public async bookEvent(eventID: number): Promise<boolean> {
    const url = new URL(`${SERVER_URL}/user/bookEvent`);
    url.searchParams.append('eventID', eventID.toString());
    const response = await fetch(url.toString(), {
      headers: { Authorization: this.jwt_token },
    });

    return response.ok;
  }
  public async getFutureEvents(): Promise<Event[]> {
    const response = await fetch(`${SERVER_URL}/user/futureEvents`, {
      headers: { Authorization: this.jwt_token },
    });
    const data = (await response.json()) as Event[];
    return data;
  }

  public async getBookedEvents(): Promise<Event[]> {
    const response = await fetch(`${SERVER_URL}/user/bookedEvents`, {
      headers: { Authorization: this.jwt_token },
    });
    const data = (await response.json()) as Event[];
    return data;
  }

  public getSponsorEvents(): Promise<Event[]> {
    return getSponsorEvents(this.jwt_token);
  }
}

export default Parent;
