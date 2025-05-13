import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Search Homes", href: "/search" },
  { label: "Featured", href: "/featured" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Home Estimate", href: "/home-estimate" },
  { label: "Blog", href: "/blog" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

export const Navbar: React.FC = () => {
  return (
    <div>
      <header className="nav-header">
        <div className="nav-box">
          <div className="nav-img-box">
            <img
              src="/nav/DesertValleyHomeSearch-com.png"
              alt="Desert Valley Home Search Logo"
              className="nav-logo-img"
            />
            <div className="nav-name-img-box">
              <img
                src="/nav/Presented-by.png"
                alt=""
                className="presented-by"
              />
              <img
                src="/nav/Damon-Ryon-2.png"
                alt=""
                className="name-img-logo"
              />
            </div>
            <img
              src="/nav/Damon-P.jpg"
              alt=""
              className="damon-picture"
            />
          </div>
          <div className="nav-link-box">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="nav-link"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};
