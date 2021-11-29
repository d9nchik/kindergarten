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
    name: 'Excursion to Kovel',
    price: 10,
    date: new Date('2022-10-11'),
    start_time: '8:00:00',
    end_time: '21:00:00',
    min_participants_count: 12,
    detailed_info: null,
    id: 123456,
    user_joined: 10,
  },
  {
    name: 'Excursion to Lublin',
    price: 15,
    date: new Date('2022-10-12'),
    start_time: '6:00:00',
    end_time: '23:00:00',
    min_participants_count: 20,
    detailed_info: 'Visit the city of Poland',
    id: 123457,
    user_joined: 8,
  },
  {
    name: 'Excursion to Bukovel',
    price: 12,
    date: new Date('2022-10-13'),
    start_time: '5:00:00',
    end_time: '21:00:00',
    min_participants_count: 25,
    detailed_info: null,
    id: 123458,
    user_joined: 10,
  },
];

const search: RouteHandlerMethod = async (req, res) => {
  // 20 seconds delay
  await sleep(20_000);
  if (req.validationError) {
    res.code(400).send(req.validationError);
    return;
  }
  const payload = req.query as { userID: number; maxMoneyLimit: number };
  return payload.maxMoneyLimit
    ? providerEvents.filter(({ price }) => price < payload.maxMoneyLimit)
    : providerEvents;
};

const provider1: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify,
  _,
  done,
) => {
  fastify.route({
    method: 'GET',
    url: '/search',
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: search,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          maxMoneyLimit: { type: 'number' },
        },
      },
    },
    attachValidation: true,
  });

  done();
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default provider1;
