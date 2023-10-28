import Organisation from './components/Organisation';
import User from './components/User';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import IndexPage from '@pages';
import RegisterPage from '@pages/register';

function App() {
  return (
    <>
      <Routes>
        <Route 
          path='/user' 
          exact 
          element={(
            <>
              <Navbar />
              <Carousel />
              <User />
              <Footer />
            </>
          )} 
        />
        <Route path='/test' exact element={<IndexPage />} />
        <Route path='/register' exact element={<RegisterPage />} />
        <Route 
          path='/' 
          exact 
          element={(
            <>
              <Navbar />
              <Carousel />
              <Organisation />
              <Footer />
            </>
          )} 
        />
      </Routes>
    </>
  );
}

export default App;
