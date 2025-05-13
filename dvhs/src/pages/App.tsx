// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "../css/navbar.css";
import "../css/hero.css";
import "../css/index.css";
import { Navbar } from "../components/navbar";
import { Route, Routes } from "react-router-dom";
import { SearchForm } from "../components/hero";

function App() {
  // const [count, setCount] = useState(0);

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
          </div>
        }
      />
    </Routes>
  );
}

export default App;
