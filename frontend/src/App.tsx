import { Routes, Route } from "react-router-dom";
import {
  CompleteProfilePage,
  FavoritePage,
  HomePage,
  ResultPage,
  UserPage,
  InformationPage,
} from "./pages";
import "./index.css";
import { Header } from "./components/Header";
import { AuthRedirectHandler } from "./components/User";
import { Breadcrumbs } from "./components/Breadcrumbs";

function App() {
  return (
    <>
      <Header />
      <AuthRedirectHandler />
      <Breadcrumbs />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<ResultPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/games/:id" element={<InformationPage />} />
        <Route path="/completeprofile" element={<CompleteProfilePage />} />
        <Route path="/profile" element={<UserPage />} />
      </Routes>
    </>
  );
}

export default App;
