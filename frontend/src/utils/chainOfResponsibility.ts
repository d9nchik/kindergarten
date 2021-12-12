import { SERVER_URL } from './user';

const TIME_IN_MILISECONDS_OF_CACHE_INVALIDATION = 1000 * 60 * 60 * 3;

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

const getProvider1Data = async (
  token: string,
  subString: string,
): Promise<Event[]> => {
  const cache = localStorage.getItem('cache/provider1');
  if (!cache) {
    const response = await fetch(`${SERVER_URL}/provider1/search`, {
      headers: { Authorization: token },
    });
    const data = (await response.json()) as Event[];
    localStorage.setItem(
      'cache/provider1',
      JSON.stringify({ data, time: Date.now() }),
    );
    return data.filter(({ name }) => name.includes(subString));
  }

  const res = JSON.parse(cache) as { time: number; data: Event[] };
  if (res.time + TIME_IN_MILISECONDS_OF_CACHE_INVALIDATION < Date.now()) {
    (async () => {
      const response = await fetch(`${SERVER_URL}/provider1/search`, {
        headers: { Authorization: token },
      });
      try {
        const data = (await response.json()) as Event[];
        localStorage.setItem(
          'cache/provider1',
          JSON.stringify({ data, time: Date.now() }),
        );
      } catch {
        console.log('Problem with cache updating');
      }
    })();
  }
  return res.data.filter(({ name }) => name.includes(subString));
};

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

export async function getSponsorEvents(
  token: string,
  subString: string,
): Promise<Event[]> {
  const provider1Result = getProvider1Data(token, subString);

  return [
    ...(await provider1Result),
    // ...(await provider1Handler.handle('provider2')),
  ];
}
