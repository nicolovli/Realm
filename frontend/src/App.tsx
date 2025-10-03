import { Routes, Route } from "react-router-dom";
import { FavoritePage, HomePage, LoginPage, ResultPage } from "./pages";
import "./index.css";
import { Header } from "./components/Header/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
      </Routes>
    </>
  );
}

export default App;
