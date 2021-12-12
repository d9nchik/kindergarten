import { SERVER_URL } from './user';

const START_TIME = 9;
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
  if (res.time < new Date().setHours(START_TIME, 0, 0, 0)) {
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
interface Provider2LocalStorageSchema {
  time: number;
  priceList: ShortEvent[];
  itemsDescription: { [key: string]: Event | undefined };
}

const getProvider2Data = async (
  token: string,
  subString: string,
): Promise<Event[]> => {
  const cache = localStorage.getItem('cache/provider2');
  let parsed: Provider2LocalStorageSchema;
  if (!cache) {
    const response = await fetch(`${SERVER_URL}/provider2/price-list`, {
      headers: { Authorization: token },
    });
    const data = (await response.json()) as ShortEvent[];
    parsed = { time: Date.now(), priceList: data, itemsDescription: {} };
  } else {
    parsed = JSON.parse(cache);
  }

  if (parsed.time < new Date().setHours(START_TIME, 0, 0, 0)) {
    const response = await fetch(`${SERVER_URL}/provider2/price-list`, {
      headers: { Authorization: token },
    });
    const data = (await response.json()) as ShortEvent[];
    parsed = { time: Date.now(), priceList: data, itemsDescription: {} };
  }

  const result = Promise.all(
    parsed.priceList
      .filter(({ name }) => name.includes(subString))
      .slice(0, 100)
      .map(async ({ id }) => {
        const dictionaryEvent = parsed.itemsDescription[id];
        if (dictionaryEvent) {
          return dictionaryEvent;
        }
        const url = new URL(`${SERVER_URL}/provider2/details`);
        url.searchParams.append('eventID', id.toString());
        const response = await fetch(url.toString(), {
          headers: { Authorization: token },
        });
        const event = (await response.json()) as Event;
        parsed.itemsDescription[id] = event;
        return event;
      }),
  );
  localStorage.setItem('cache/provider2', JSON.stringify(parsed));
  return result;
};

export async function getSponsorEvents(
  token: string,
  subString: string,
): Promise<Event[]> {
  const provider1Result = getProvider1Data(token, subString);
  const provider2Result = getProvider2Data(token, subString);

  return [...(await provider1Result), ...(await provider2Result)];
}
