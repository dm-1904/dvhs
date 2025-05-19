import "../css/index.css";
import { Navbar } from "../components/navbar";
import { Route, Routes } from "react-router-dom";
import { SearchForm } from "../components/hero";
import { ContactForm } from "../components/contactUs";
import NeighborhoodGuides from "../components/neighborhoodGuides";
import FeaturedCarousel from "../components/featuredCarousel";
import QuickSearches from "../components/quickSearches";
import { Footer } from "../components/footer";
import SearchBar from "../components/searchBar";
import { About } from "../components/about";
import { BlogHome } from "../components/blog";
import { MortgageRate } from "../components/mortgageRate";

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
      <Route
        path="search"
        element={
          <div className="app-search-container">
            <Navbar /> <SearchBar /> <Footer />
          </div>
        }
      />
      <Route
        path="about"
        element={
          <div className="app-about-container">
            <Navbar />
            <About />
            <ContactForm
              onSubmit={(data) => console.log("Contact form data:", data)}
            />
            <Footer />
          </div>
        }
      />
      <Route
        path="contact"
        element={
          <div className="app-contact-container">
            <Navbar />
            <MortgageRate />
            <div className="pre-connect-content-box">
              <h1>I'd love to hear from you!</h1>
              <span>
                Just fill out the form below and I'll get back to you as soon as
                possible.
                <br />
                Or just let me know in the Message box when is a good time to
                talk or if you prefer text or email.
                <div className="pre-connect-footer" />I look forward to hearing
                from you!
              </span>
            </div>
            <ContactForm
              onSubmit={(data) => console.log("Contact form data:", data)}
            />
            <Footer />
          </div>
        }
      />
      <Route
        path="blog"
        element={
          <div className="app-blog-container">
            <Navbar />
            <BlogHome />
            <div className="blog-content-box"></div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
