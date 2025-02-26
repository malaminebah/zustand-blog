import { useEffect, useState } from 'react';
import { useArticleStore } from '../../store/articleStore.js';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './styles.css';

interface ExpandedState {
  [key: string]: boolean;
}

const ArticleList = () => {
  const { articles, loading, error, fetchArticles, deleteArticle } = useArticleStore();
  const [expandedArticles, setExpandedArticles] = useState<ExpandedState>({});

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const toggleArticle = (id: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const truncateContent = (content: string, expanded: boolean) => {
    if (expanded) return content;
    return content.length > 100 ? `${content.slice(0, 100)}...` : content;
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="article-list">
      {articles.map(article => (
        <article key={article.id} className="article-card">
          <h2 className="article-title">{article.title}</h2>
          <p className="article-content">
            {truncateContent(article.content, expandedArticles[article.id])}
          </p>
          {article.content.length > 100 && (
            <button 
              className="expand-button"
              onClick={() => toggleArticle(article.id)}
            >
              {expandedArticles[article.id] ? (
                <>
                  <span>Voir moins</span>
                  <ChevronUp size={20} />
                </>
              ) : (
                <>
                  <span>Voir plus</span>
                  <ChevronDown size={20} />
                </>
              )}
            </button>
          )}
          <div className="article-footer">
            <time className="article-date">
              {new Date(article.createdAt).toLocaleDateString()}
            </time>
            <button 
              onClick={() => deleteArticle(article.id)}
              className="delete-button"
              aria-label="Supprimer l'article"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ArticleList; 