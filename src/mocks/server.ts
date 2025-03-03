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
    createArticle(title: String!, content: String!, tags:[String!]!): Article!
    deleteArticle(id: ID!): Boolean!
    updateArticleTags(id:ID!, tags:[String!]!):Article!
  }
`;

const articles = [
  {
    id: "1",
    title: "Introduction à Zustand : Un gestionnaire d'état minimaliste pour React",
    content: `Zustand est une solution de gestion d'état légère et performante pour React qui révolutionne la façon dont nous gérons l'état dans nos applications. Contrairement à Redux, qui nécessite beaucoup de code boilerplate, Zustand adopte une approche minimaliste et intuitive.

Les principaux avantages de Zustand incluent :
• Une API simple et directe qui réduit la complexité
• Pas besoin de Provider comme avec Redux ou Context
• Support natif de TypeScript avec une excellente inférence de types
• Performances optimisées avec des mises à jour sélectives
• Bundle size minimal qui n'alourdit pas votre application

Voici un exemple concret d'utilisation de Zustand :

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 })
}));

Cette simplicité ne sacrifie pas la puissance - Zustand supporte les actions asynchrones, le middleware, et peut même être utilisé avec les outils de développement Redux.`,
    createdAt: "2024-01-15T10:00:00.000Z",
    tags: ["React", "State Management", "Zustand"]
  },
  {
    id: "2",
    title: "GraphQL vs REST : Pourquoi choisir GraphQL pour votre API ?",
    content: `GraphQL représente une évolution majeure dans la conception d'APIs, offrant une alternative flexible et puissante aux APIs REST traditionnelles. Cette technologie, développée par Facebook, résout de nombreux problèmes courants rencontrés avec REST.

Avantages principaux de GraphQL :
1. Requêtes précises : Les clients spécifient exactement les données dont ils ont besoin
2. Un seul endpoint : Fini les multiples endpoints REST
3. Typage fort : Un système de types qui sécurise vos APIs
4. Documentation auto-générée : Plus besoin de maintenir une documentation séparée
5. Résolution des problèmes de sur-fetching et sous-fetching

Exemple de requête GraphQL :
query {
  user(id: "123") {
    name
    email
    posts {
      title
      comments {
        content
        author {
          name
        }
      }
    }
  }
}

Cette flexibilité permet aux clients mobiles de demander moins de données que les clients web, optimisant ainsi la bande passante et les performances. GraphQL brille particulièrement dans les applications modernes avec des besoins en données complexes et variables.`,
    createdAt: "2024-01-16T14:30:00.000Z",
    tags: ["GraphQL", "API", "REST"]
  },
  {
    id: "3",
    title: "React 18 : Les nouvelles fonctionnalités à connaître",
    content: `React 18 introduit des changements fondamentaux qui améliorent significativement les performances et l'expérience utilisateur des applications React. Cette mise à jour majeure apporte le concurrent rendering et de nombreuses fonctionnalités attendues par la communauté.

Principales nouveautés :
1. Concurrent Rendering
- Permet des mises à jour interruptibles de l'interface utilisateur
- Améliore la réactivité de l'application
- Introduit de nouveaux hooks comme useTransition

2. Automatic Batching
- Regroupe automatiquement les mises à jour d'état
- Réduit le nombre de re-renders
- Améliore les performances globales

3. Suspense sur le serveur
- Support du rendu côté serveur avec streaming
- Hydratation sélective des composants
- Meilleure expérience utilisateur pendant le chargement

4. Nouveaux hooks
useId() : Génération d'IDs uniques
useTransition() : Gestion des mises à jour non urgentes
useDeferredValue() : Report des mises à jour coûteuses

Exemple d'utilisation de useTransition :
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setCount(count + 1);
});

Ces améliorations permettent de créer des applications plus rapides et plus réactives, avec une meilleure gestion des mises à jour concurrentes et des états de chargement.`,
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