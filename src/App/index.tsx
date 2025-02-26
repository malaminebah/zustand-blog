import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo.js';
import ArticleList from '../components/ArticleList';
import CreateArticle from '../components/CreateArticle';
import Navbar from '../components/Navbar';
import './styles.css';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <Navbar />
        <main className="app-main">
          <CreateArticle />
          <ArticleList />
        </main>
      </div>
    </ApolloProvider>
  );
};

export default App; 