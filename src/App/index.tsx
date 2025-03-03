import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo.js';
import Navbar from '../components/Navbar/index.js';
import ArticleList from '../components/ArticleList/index.js';
import CreateArticle from '../components/CreateArticle/index.js';
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