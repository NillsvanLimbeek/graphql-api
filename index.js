const { ApolloServer, gql } = require('apollo-server');

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const typeDefs = gql`
    scalar Date

    type Movie {
        title: String
        releaseDate: String
        rating: Int
        actors: [Actor]!
    }

    type Actor {
        id: ID!
        name: String!
    }

    type Query {
        movies: [Movie]
        movie(id: ID!): Movie
    }
`;

const movies = [
    {
        id: '001',
        title: 'Movie #1',
        releaseDate: new Date('01-01-1980'),
        rating: 5,
        actors: ['nills', 'kay'],
    },
    {
        id: '002',
        title: 'Movie #2',
        releaseDate: new Date('01-01-1981'),
        rating: 3,
        actors: ['charlie'],
    },
];

const actors = [
    {
        id: 'nills',
        name: 'Nills van Limbeek',
    },
    {
        id: 'charlie',
        name: 'Charlie',
    },
    {
        id: 'kay',
        name: 'Kay van Limbeek',
    },
];

const resolvers = {
    Query: {
        movies: () => {
            return movies;
        },
        movie: (root, { id }, ctx) => {
            return movies.find((movie) => movie.id === id);
        },
    },

    Movie: {
        actors: (root, args, ctx) => {
            return actors.filter((actor) => {
                return root.actors.includes(actor.id);
            });
        },
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date value',
        parseValue(value) {
            // value from the client
            return new Date(value);
        },
        serialize(value) {
            // value send to the client
            return value.toTime();
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) return new Date(ast.value);

            return null;
        },
    }),
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server started at ${url}`);
});
