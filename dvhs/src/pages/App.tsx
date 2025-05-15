import "../css/index.css";
import { Navbar } from "../components/navbar";
import { Route, Routes } from "react-router-dom";
import { SearchForm } from "../components/hero";
import { ContactForm } from "../components/contactUs";
import NeighborhoodGuides from "../components/neighborhoodGuides";
import FeaturedCarousel from "../components/featuredCarousel";
import QuickSearches from "../components/quickSearches";
import { Footer } from "../components/footer";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app-container">
            <Navbar />{" "}
            <SearchForm
              onSearch={(data) => console.log("Search data:", data)}
            />
            <ContactForm
              onSubmit={(data) => console.log("Contact form data:", data)}
            />
            <NeighborhoodGuides />
            <FeaturedCarousel />
            <QuickSearches />
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
