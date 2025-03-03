import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

const typeDefs = `#graphql
  type Article {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    tags: [String!]!
  }

  type Query {
    articles: [Article!]!
    article(id: ID!): Article
    articlesByTag(tag: String!): [Article!]!
  }

  type Mutation {
    createArticle(title: String!, content: String!): Article!
    deleteArticle(id: ID!): Boolean!
    updateArticleTags(id:ID!, tags:[String!]!):Article!
  }
`;

const articles = [
  {
    id: "1",
    title: "Introduction à Zustand : Un gestionnaire d'état minimaliste pour React",
    content: `Zustand est une solution de gestion d'état légère et performante pour React...`,
    createdAt: "2024-01-15T10:00:00.000Z",
    tags: ["React", "State Management", "Zustand"]
  },
  {
    id: "2",
    title: "GraphQL vs REST : Pourquoi choisir GraphQL pour votre API ?",
    content: `GraphQL révolutionne la façon dont nous concevons nos APIs...`,
    createdAt: "2024-01-16T14:30:00.000Z",
    tags: ["GraphQL", "API", "REST"]
  },
  {
    id: "3",
    title: "React 18 : Les nouvelles fonctionnalités à connaître",
    content: `React 18 apporte des améliorations majeures en termes de performance...`,
    createdAt: "2024-01-17T09:15:00.000Z",
    tags: ["React", "Performance", "React 18"]
  }
];

const resolvers = {
  Query: {
    articles: () => articles,
    article: (_: any, { id }: { id: string }) => 
      articles.find(article => article.id === id),
    articlesByTag:(_:any,{tag}:{tag:string})=>articles.filter(article=>article.tags.includes(tag))
  },
  Mutation: {
    createArticle: (_: any, { title, content, tags }: { title: string; content: string , tags:string[] }) => {
      const newArticle = {
        id: String(articles.length + 1),
        title,
        content,
        createdAt: new Date().toISOString(),
        tags:tags || []
      };
      articles.push(newArticle);
      return newArticle;
    },
    updateArticleTags: (_: any, { id, tags }: { id: string; tags: string[] }) => {
        const article = articles.find(a => a.id === id);
        if (!article) throw new Error('Article non trouvé');
        
        article.tags = tags;
        return article;
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

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`); 