import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Other routes go here */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
