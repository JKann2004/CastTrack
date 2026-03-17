import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/navigationBar';
import Footer from './components/footer';
import HomePage from "./pages/homePage";
import LoginButton from "./components/login";

function App() {
  return (
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path="/" element= {<HomePage />} />
        <Route path="/regulationPage" element= {<h1>Regulations</h1>} />
        <Route path="/catchPage" element= {<h1>Catches</h1>} />
        <Route path="/eventPage" element= {<h1>Events and Advisories</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;