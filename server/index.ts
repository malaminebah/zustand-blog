import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import cors from 'cors';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const typeDefs = `#graphql
  type Article {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
  }

  type Query {
    articles: [Article!]!
    article(id: ID!): Article
  }

  type Mutation {
    createArticle(title: String!, content: String!): Article!
    deleteArticle(id: ID!): Boolean!
  }
`;

const articles = [
  {
    id: "1",
    title: "Introduction à Zustand : Un gestionnaire d'état minimaliste pour React",
    content: `Zustand est une solution de gestion d'état légère et performante pour React...`,
    createdAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: "2",
    title: "GraphQL vs REST : Pourquoi choisir GraphQL pour votre API ?",
    content: `GraphQL révolutionne la façon dont nous concevons nos APIs...`,
    createdAt: "2024-01-16T14:30:00.000Z"
  },
  {
    id: "3",
    title: "React 18 : Les nouvelles fonctionnalités à connaître",
    content: `React 18 apporte des améliorations majeures en termes de performance...`,
    createdAt: "2024-01-17T09:15:00.000Z"
  }
];

const resolvers = {
  Query: {
    articles: () => articles,
    article: (_: any, { id }: { id: string }) => 
      articles.find(article => article.id === id),
  },
  Mutation: {
    createArticle: (_: any, { title, content }: { title: string; content: string }) => {
      const newArticle = {
        id: String(articles.length + 1),
        title,
        content,
        createdAt: new Date().toISOString(),
      };
      articles.push(newArticle);
      return newArticle;
    },
    deleteArticle: (_: any, { id }: { id: string }) => {
      const index = articles.findIndex(article => article.id === id);
      if (index === -1) return false;
      articles.splice(index, 1);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    token: req.headers.authorization,
  }),
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
}); 