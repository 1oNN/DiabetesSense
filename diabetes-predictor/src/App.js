import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./components/RoutesComponent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <RoutesComponent />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
