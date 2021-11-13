import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteHandlerMethod,
} from 'fastify';

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

const priceList: RouteHandlerMethod = async () =>
  providerEvents.map(({ name, price, id }) => ({
    name,
    price,
    id,
  }));

const idDetails: RouteHandlerMethod = async (req, res) => {
  if (req.validationError) {
    res.code(400).send(req.validationError);
    return;
  }
  const { eventID } = req.query as { userID: number; eventID: number };
  const event = providerEvents.filter(({ id }) => id === eventID);
  if (event.length === 0) return res.status(404).send('Event not found');
  return event[0];
};

const provider1: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'GET',
    url: '/price-list',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: priceList,
  });

  fastify.route({
    method: 'GET',
    url: '/details',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: idDetails,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          eventID: { type: 'number' },
        },
        required: ['eventID'],
      },
    },
    attachValidation: true,
  });

  done();
};

export default provider1;
