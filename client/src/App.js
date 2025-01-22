import "./App.css";
import Board from "./Board";
import PlayingBoard from "./PlayingBoard";
import PlayingPage from "./PlayingPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/game" element={<PlayingPage />} />
        </Routes>
      </Router>
    </div> 
  );
}

export default App;
