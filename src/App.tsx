import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import LoadingScreen from "./components/ui/LoadingScreen";

// Route-level code splitting — each page bundle loads only when visited
const TeasPage    = lazy(() => import("./pages/TeasPage"));
const EngageUsPage = lazy(() => import("./pages/EngageUsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

export default function App() {
  return (
    <>
      <Nav />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/"          element={<TeasPage />} />
          <Route path="/teas"      element={<TeasPage />} />
          <Route path="/engage-us" element={<EngageUsPage />} />
          <Route path="/contact"   element={<ContactPage />} />
          {/* Fallback — redirect unknown paths to Teas */}
          <Route path="*"          element={<TeasPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
