import { create } from 'zustand';
import { gql } from '@apollo/client';
import { client } from '../lib/apollo.js';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface ArticleStore {
  articles: Article[];
  loading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  createArticle: (title: string, content: string) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
}

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      createdAt
    }
  }
`;

const CREATE_ARTICLE = gql`
  mutation CreateArticle($title: String!, $content: String!) {
    createArticle(title: $title, content: $content) {
      id
      title
      content
      createdAt
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

  createArticle: async (title: string, content: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.mutate({
        mutation: CREATE_ARTICLE,
        variables: { title, content },
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