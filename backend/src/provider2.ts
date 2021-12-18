interface Event {
  name: string;
  id: number;
  price: number;
  date: Date;
  start_time: string;
  end_time: string | null;
  min_participants_count: number;
  detailed_info: string | null;
  user_joined: number;
}

const providerEvents: Event[] = [
  {
    name: 'Excursion to Zhytomyr',
    price: 10,
    date: new Date('2022-10-21'),
    start_time: '8:00:00',
    end_time: '21:00:00',
    min_participants_count: 12,
    detailed_info: null,
    id: 123466,
    user_joined: 10,
  },
  {
    name: 'Excursion to Varsawa',
    price: 15,
    date: new Date('2022-10-22'),
    start_time: '4:00:00',
    end_time: '23:00:00',
    min_participants_count: 20,
    detailed_info: 'Visit the capital city of Poland',
    id: 123467,
    user_joined: 8,
  },
  {
    name: 'Excursion to Vinyza',
    price: 10,
    date: new Date('2022-10-23'),
    start_time: '10:00:00',
    end_time: '21:00:00',
    min_participants_count: 25,
    detailed_info: 'Let\'s visit "Roshen" chocolate factory',
    id: 123468,
    user_joined: 10,
  },
];

export const priceList = () =>
  providerEvents.map(({ name, price, id }) => ({
    name,
    price,
    id,
  }));

export const idDetails = (eventID: number): Event | null => {
  const event = providerEvents.filter(({ id }) => id === eventID);
  if (event.length === 0) return null;
  return event[0];
};
