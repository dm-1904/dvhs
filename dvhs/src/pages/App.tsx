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
// import { MortgageRate } from "../components/mortgageRate";
import { Login } from "../components/login";
import { SignUp } from "../components/signUp";
import { HomeValueForm } from "../components/homeValueForm";
import { TermsOfUse } from "../components/termsOfUse";
import { PrivacyPolicy } from "../components/privacyPolicy";
import HomesForSaleInSurprise from "../blog/posts/homesForSaleInSurpriseAz";

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
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="search"
        element={
          <div className="app-search-container">
            <Navbar />
            <SearchBar />
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="featured"
        element={
          <div className="app-featured-container">
            <Navbar />
            <FeaturedCarousel />
            <Footer />
            {/* <MortgageRate /> */}
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
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="contact"
        element={
          <div className="app-contact-container">
            <Navbar />

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
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="home-estimate"
        element={
          <div className="app-home-estimate-container">
            <Navbar />
            <div className="home-estimate-content-box">
              <h1>Home Estimate</h1>
              <span>
                Get a free home estimate by filling out the form below.
                <br />I will get back to you as soon as possible with your
                estimate.
              </span>
            </div>
            <HomeValueForm
              onSubmit={(data) => console.log("Home value form data:", data)}
            />
            <Footer />
            {/* <MortgageRate /> */}
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
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="blog/:homes-for-sale-in-surprise-az"
        element={
          <div className="app-blog-detail-container">
            <Navbar />
            <HomesForSaleInSurprise />
            <ContactForm
              onSubmit={(data) => console.log("Contact form data:", data)}
            />
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="login"
        element={
          <div className="app-login-container">
            <Navbar />
            <Login onSubmit={(data) => console.log("Login data:", data)} />
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="signup"
        element={
          <div className="app-signup-container">
            <Navbar />
            <SignUp onSubmit={(data) => console.log("Signup data:", data)} />
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="terms-of-use"
        element={
          <div className="app-terms-of-use-container">
            <Navbar />
            <TermsOfUse />
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
      <Route
        path="privacy-policy"
        element={
          <div className="app-privacy-policy-container">
            <Navbar />
            <PrivacyPolicy />
            <Footer />
            {/* <MortgageRate /> */}
          </div>
        }
      />
    </Routes>
  );
}

export default App;
