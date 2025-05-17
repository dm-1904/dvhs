import React from "react";
import "../css/about.css";

export const About: React.FC = () => {
  return (
    <section className="about-container">
      <div className="about-content">
        <div className="about-header-box">
          <h1>Damon Ryon</h1>
        </div>
        <div className="about-text">
          <div className="about-image">
            <img
              src="/nav/Damon-P.jpg"
              alt="Damon Ryon"
              className="about-photo"
            />
          </div>
          <div className="about-text-box">
            <p>
              Hi, I’m Damon Ryon – a U.S. Marine Corps veteran, full-time real
              estate professional, and someone who believes in doing things
              right the first time. My background in the Marine Corps instilled
              in me a relentless work ethic, a commitment to excellence, and the
              discipline to deliver results — qualities I now bring to every
              real estate transaction.
            </p>
            <p>
              With years of experience in the Arizona real estate market, I’ve
              helped buyers and sellers navigate every type of deal – from first
              homes to retirement communities and everything in between. I don’t
              just open doors and hand out brochures — I work side-by-side with
              you to create a strategic plan, keep you informed every step of
              the way, and make sure nothing slips through the cracks.
            </p>
            <p>
              My clients know me for being thorough, honest, and responsive.
              Whether it’s pricing your home correctly, negotiating a better
              deal, or spotting a problem before it happens, I make sure every
              detail is handled with the same level of precision and care.
            </p>
            <p>
              If you're looking for a Realtor who will go the extra mile, fight
              for your best interests, and treat your goals like they’re his own
              — I’d be honored to work with you.
            </p>
            <p className="signature">– Damon Ryon</p>
          </div>
        </div>
      </div>
    </section>
  );
};
