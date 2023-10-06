import './App.css';
import Organisation from './components/Organisation';
import User from './components/User';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
      <Route path='/' element = {<Organisation/>}/>
      <Route path='/user' element = {<User/>}/>
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
