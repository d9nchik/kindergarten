import { SERVER_URL } from './user';

interface ShortEvent {
  name: string;
  id: number;
  price: number;
}

export interface Event extends ShortEvent {
  date: string;
  start_time: string;
  end_time: string;
  min_participants_count: number;
  detailed_info: string;
  user_joined: number;
}

interface Handler {
  setNext(h: Handler): void;
  handle(request: string): Promise<Event[]>;
}

export class BaseHandler implements Handler {
  next: Handler | null = null;
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  public setNext(h: Handler) {
    this.next = h;
  }

  public async handle(request: string): Promise<Event[]> {
    if (!this.next) {
      return [];
    }
    return this.next.handle(request);
  }
}

export class Provider1Handler extends BaseHandler {
  public async handle(request: string): Promise<Event[]> {
    if (request !== 'provider1') {
      return super.handle(request);
    }

    const response = await fetch(`${SERVER_URL}/provider1/search`, {
      headers: { Authorization: this.token },
    });
    const data = (await response.json()) as Event[];
    return data;
  }
}

export class Provider2Handler extends BaseHandler {
  public async handle(request: string): Promise<Event[]> {
    if (request !== 'provider2') {
      return super.handle(request);
    }

    const response = await fetch(`${SERVER_URL}/provider2/price-list`, {
      headers: { Authorization: this.token },
    });
    const data = (await response.json()) as ShortEvent[];

    return Promise.all(
      data.map(async ({ id }) => {
        const url = new URL(`${SERVER_URL}/provider2/details`);
        url.searchParams.append('eventID', id.toString());
        const response = await fetch(url.toString(), {
          headers: { Authorization: this.token },
        });
        return (await response.json()) as Event;
      }),
    );
  }
}

export async function getSponsorEvents(token: string): Promise<Event[]> {
  const provider1Handler = new Provider1Handler(token);
  const provider2Handler = new Provider2Handler(token);
  provider1Handler.setNext(provider2Handler);

  return [
    ...(await provider1Handler.handle('provider1')),
    ...(await provider1Handler.handle('provider2')),
  ];
}
