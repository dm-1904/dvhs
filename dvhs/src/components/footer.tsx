import "../css/footer.css";

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Search Homes", href: "/search" },
  { label: "Featured", href: "/featured" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Home Estimate", href: "/home-estimate" },
  { label: "Blog", href: "/blog" },
];

export const Footer: React.FC = () => {
  const now = new Date();
  const year = now.getFullYear();
  const lastUpdated = now.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
  return (
    <>
      <span className="footer-underline" />

      <footer className="footer">
        <div className="footer-content">
          <h3 className="footer-menu">Menu</h3>
          <div className="footer-menu">
            {menuItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="footer-menu-item"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="footer-logo">
            <img
              src="/broker-logo-transparent.png"
              alt=""
              className="footer-broker-logo"
            />
          </div>
          <div className="broker-address">
            <span>
              Deal Landers Arizona Realty <br />
              17310 W Wildwood St. <br />
              Surprise, AZ 85388 <br />
              623-295-8169
            </span>
          </div>
          <div className="ryon-group-logo">
            <img
              src="/nav/ryon-group.png"
              alt=""
            />
          </div>
          <div className="footer-realtor-logos">
            <img
              src="/equal-housing-opportunity.png"
              alt=""
              className="footer-equal-housing-logo"
            />
            <img
              src="MLS-clear.png"
              alt=""
              className="footer-mls-logo"
            />
          </div>
          <div className="footer-disc">
            <a href="">TERMS OF USE</a>
            <a href="">PRIVACY NOTICE</a>
            <a href="">DMCA</a>
          </div>
        </div>
      </footer>
      <div className="footer-disc-statement">
        <p>
          © {year} Arizona Regional Multiple Listing Service&nbsp;• All Rights
          Reserved&nbsp;• The data relating to real estate for sale on this
          website comes in part from the Arizona Regional Multiple Listing
          Service. Real estate listings held by brokerage firms other than Damon
          Ryon - Deal Landers Arizona Realty are marked with the Arizona
          Regional Multiple Listing Service logo and detailed information about
          them includes the name of the listing brokers. All information deemed
          reliable but not guaranteed and should be independently verified. All
          properties are subject to prior sale, change or withdrawal. Neither
          listing broker(s) nor Arizona Regional Multiple Listing Service shall
          be responsible for any typographical errors, misinformation, misprints
          and shall be held totally harmless. {lastUpdated}
        </p>
      </div>
    </>
  );
};
