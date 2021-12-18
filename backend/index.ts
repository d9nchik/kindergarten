import { ApolloServer, gql } from 'apollo-server';
import {
  bookedEvents,
  futureEvents,
  bookEvent,
  getEventByID,
} from './src/user';
import { search } from './src/provider1';
import { priceList, idDetails } from './src/provider2';
import {
  getAllOrganizers,
  getOrganizer,
  updateOrganizer,
  getNotSelectedEvents,
  selectEvent,
  futureEvents as adminFutureEvents,
} from './src/manager';
import { getEventsType, addEvent } from './src/organizer';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Event {
    id: ID!
    name: String!
    price: Float!
    date: String!
    start_time: String!
    end_time: String
    min_participants_count: Int!
    detailed_info: String
    user_joined: Int!
  }

  type Organizer {
    organizerID: ID!
    name: String!
    address: String!
    phone_number: String!
    site: String
    mail: String!
    detailed_info: String
  }

  input OrganizerInput {
    organizerID: String!
    name: String!
    address: String!
    phone_number: String!
    site: String
    mail: String!
    detailed_info: String
  }

  type EventType {
    id: ID!
    name: String!
  }

  type AdminEvent {
    id: ID!
    name: String!
    price: Float!
    date: String!
    start_time: String!
    end_time: String
    min_participants_count: Int!
    detailed_info: String
  }

  input AddEvent {
    eventTypeID: String!
    userOrganizerID: String!
    name: String!
    date: Int!
    startTime: String!
    endTime: String
    price: Float!
    minParticipantsCount: Int!
    detailedInfo: String
  }

  type ShortOrganizer {
    id: ID!
    companyName: String!
  }

  type ShortEvent {
    id: ID!
    name: String!
    price: Float!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    futureEvents(userID: ID!, subString: String): [Event!]!
    bookedEvents(userID: ID!): [Event!]
    provider1Events(maxMoneyLimit: Float): [Event!]!
    provider2List: [ShortEvent!]!
    provider2Event(eventID: ID!): Event
    organizerList: [ShortOrganizer!]!
    organizerInfo(organizerID: ID!): Organizer!
    eventTypes: [EventType!]!
    notSelectedEvents: [AdminEvent!]!
    adminFutureEvents: [AdminEvent!]!
  }

  type Mutation {
    bookEvent(eventID: ID!, userID: ID!): Event
    updateOrganizer(org: OrganizerInput!): Organizer
    addEvent(event: AddEvent!): Event
    selectEvent(eventID: Int!): Event
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    futureEvents: async (_: any, args: Record<string, any>) => {
      return futureEvents(args.userID, args.subString);
    },
    bookedEvents: async (_: any, args: Record<string, any>) =>
      bookedEvents(args.userID),
    provider1Events: (_: any, args: Record<string, any>) =>
      search(args.maxMoneyLimit),
    provider2List: priceList,
    provider2Event: (_: any, args: Record<string, any>) =>
      idDetails(Number(args.eventID)),
    organizerList: getAllOrganizers,
    organizerInfo: async (_: any, args: Record<string, any>) =>
      getOrganizer(args.organizerID),
    eventTypes: getEventsType,
    notSelectedEvents: getNotSelectedEvents,
    adminFutureEvents: adminFutureEvents,
  },
  Mutation: {
    bookEvent: async (_: any, args: Record<string, any>) => {
      await bookEvent(args.eventID, args.userID);
      return getEventByID(args.eventID);
    },
    updateOrganizer: async (_: any, args: Record<string, any>) => {
      await updateOrganizer(args.org);
      return getEventByID(args.org);
    },
    addEvent: async (_: any, args: Record<string, any>) => addEvent(args.event),
    selectEvent: async (_: any, args: Record<string, any>) =>
      selectEvent(args.eventID),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
