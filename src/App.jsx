import './App.css';
import Organisation from './components/Organisation';
import User from './components/User';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    
    <Carousel/>
    
      <Routes>
      <Route path='/' element = {<Organisation/>}/>
      <Route path='/user' element = {<User/>}/>
      </Routes>

    <Footer/>
    </BrowserRouter>

    

    </>
  );
}

export default App;
