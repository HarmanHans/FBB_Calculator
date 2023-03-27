// import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';
import Calculator from './components/Calculator';
import Analysis from './components/Analysis';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path ="/calculator" element = {<Calculator />} />
          <Route path ="/analysis" element= {<Analysis />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
