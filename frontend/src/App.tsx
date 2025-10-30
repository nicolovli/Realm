import { Routes, Route } from "react-router-dom";
import {
  FavoritePage,
  HomePage,
  ResultPage,
  UserPage,
  InformationPage,
} from "./pages";
import "./index.css";
import { Header } from "./components/Header";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumbs />

      <main className="flex-grow !p-0">
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="/games" element={<ResultPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/games/:id" element={<InformationPage />} />
          <Route path="/profile" element={<UserPage />} />
        </Routes>
      </main>

      <Footer />

      <Toaster position="top-center" richColors />
    </section>
  );
}

export default App;
