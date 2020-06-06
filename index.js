const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Movie {
    title: String
    releaseDate: String
    rating: Int
  }

  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
  }
`;

const movies = [
  {
    id: "001",
    title: "Movie #1",
    releaseDate: "01-01-1980",
    rating: 5,
  },
  {
    id: "002",
    title: "Movie #2",
    releaseDate: "01-01-1981",
    rating: 3,
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
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
