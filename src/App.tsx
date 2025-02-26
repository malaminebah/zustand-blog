import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo.js';
import CreateArticle from './components/CreateArticle/index.js';
import Navbar from './components/Navbar/index.js';
import ArticleList from './components/ArticleList/index.js';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <Navbar />
        <div style={{ 
          paddingTop: '120px',
          maxWidth: '1200px',  /* Limite la largeur maximale */
          margin: '0 auto'     /* Centre le contenu */
        }}>
          <ArticleList />
        </div>
        <main>
          <CreateArticle />
        </main>
      </div>
    </ApolloProvider>
  );
};

export default App; 