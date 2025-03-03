import { create } from 'zustand';
import { gql } from '@apollo/client';
import { client } from '../lib/apollo.js';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

interface ArticleStore {
  articles: Article[];
  loading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  createArticle: (title: string, content: string ,tags:string[]) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
}

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      createdAt
      tags
    }
  }
`;

const CREATE_ARTICLE = gql`
  mutation CreateArticle($title: String!, $content: String!, $tags: [String!]!) {
    createArticle(title: $title, content: $content, tags: $tags) {
      id
      title
      content
      createdAt
      tags
    }
  }
`;

const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  loading: false,
  error: null,

  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.query({
        query: GET_ARTICLES,
      });
      set({ articles: data.articles });
    } catch (err) {
      set({ error: 'Erreur lors du chargement des articles' });
      console.error('Erreur fetchArticles:', err);
    } finally {
      set({ loading: false });
    }
  },

  createArticle: async (title: string, content: string, tags:string[]) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.mutate({
        mutation: CREATE_ARTICLE,
        variables: { title, content ,tags},
        refetchQueries: [{ query: GET_ARTICLES }],
      });
      set(state => ({
        articles: [...state.articles, data.createArticle],
      }));
    } catch (err) {
      set({ error: 'Erreur lors de la création de l\'article' });
      console.error('Erreur createArticle:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteArticle: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.mutate({
        mutation: DELETE_ARTICLE,
        variables: { id },
        refetchQueries: [{ query: GET_ARTICLES }],
      });
      if (data.deleteArticle) {
        set(state => ({
          articles: state.articles.filter(article => article.id !== id),
        }));
      }
    } catch (err) {
      set({ error: 'Erreur lors de la suppression de l\'article' });
      console.error('Erreur deleteArticle:', err);
    } finally {
      set({ loading: false });
    }
  },
})); 