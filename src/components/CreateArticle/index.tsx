import { useState, FormEvent } from 'react';
import { useArticleStore } from '../../store/articleStore.js';
import { Tag, Plus, X } from 'lucide-react';
import './styles.css';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTagsInput, setSelectedTagsInput] = useState('');

  const { createArticle, loading } = useArticleStore();

  const handelAddTags = ()=>{
    if (selectedTagsInput.trim() && !tags.includes(selectedTagsInput.trim())) {
        setTags([...tags, selectedTagsInput.trim()]);
        setSelectedTagsInput('');
      }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createArticle(title, content, tags);
      setTitle('');
      setContent('');
      setTags([]);
      setSelectedTagsInput('');
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
        <div className="tags-section">
          <div className="tags-input-container">
            <Tag size={16} />
            <input
              type="text"
              value={selectedTagsInput}
              onChange={(e) => setSelectedTagsInput(e.target.value)}
              onKeyDown={handelAddTags}
              placeholder="Ajouter des tags..."
              className="tag-input"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handelAddTags}
              className="add-tag-button"
              disabled={!selectedTagsInput.trim() || loading}
            >
              <Plus size={16} />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tags-list">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag-button"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
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