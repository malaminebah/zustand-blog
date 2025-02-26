import { useState, FormEvent } from 'react';
import { useArticleStore } from '../../store/articleStore.js';
import './styles.css';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createArticle, loading } = useArticleStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createArticle(title, content);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Erreur lors de la création:', err);
    }
  };

  return (
    <div className="create-article">
      <h2 className="create-article-title">Créer un article</h2>
      <form onSubmit={handleSubmit} className="create-article-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            required
            disabled={loading}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu de l'article..."
            required
            disabled={loading}
            className="form-textarea"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Publication...' : 'Publier'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle; 