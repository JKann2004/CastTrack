import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import NavBar from "./components/navigationBar";
import Footer from "./components/footer";
import HomePage from "./pages/homePage";
import RegulationPage from "./pages/regulationPage";
import CatchPage from "./pages/catchPage";
import EventPage from "./pages/eventPage";
import LoginButton from "./components/login";


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/regulationPage" element={<RegulationPage />} />
        <Route path="/catchPage" element={<CatchPage />} />
        <Route path="/eventPage" element={<EventPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;