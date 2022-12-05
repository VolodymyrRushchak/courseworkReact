import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import GraphPage from './components/graphPage/graphPage';
import HomePage from './components/homePage/homePage';
import TreePage from './components/treePage/treePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/graph" element={<GraphPage/>}/>
        <Route path="/tree" element={<TreePage/>}/>
        <Route path="/" element={<HomePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
