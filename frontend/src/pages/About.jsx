import React, { useEffect, useState } from "react";

const About = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const ensureLink = (id, href) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    ensureLink(
      "fa-css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
    );

    const onScroll = () => setShowTop(window.scrollY > 350);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">About SwiftShop</h1>
          <p className="page-subtitle">
            Your one-stop store for trusted electronics, clear pricing, and a smooth shopping
            experience.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="page-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-card media">
              <img src="/images/background.png" alt="SwiftShop" className="about-image" />
            </div>

            <div className="about-card content">
              <h3>What we do</h3>
              <p className="muted">
                SwiftShop brings together everyday essentials like phones, laptops, audio
                accessories, and home appliances, so you can shop confidently in one place.
              </p>

              <div className="about-highlights">
                <div className="highlight">
                  <i className="fa-solid fa-shield-halved" />
                  <div>
                    <h6>Trusted products</h6>
                    <p className="muted">We focus on reliable items and clear details.</p>
                  </div>
                </div>
                <div className="highlight">
                  <i className="fa-solid fa-tags" />
                  <div>
                    <h6>Fair pricing</h6>
                    <p className="muted">Compare quickly and buy with confidence.</p>
                  </div>
                </div>
                <div className="highlight">
                  <i className="fa-solid fa-headset" />
                  <div>
                    <h6>Fast support</h6>
                    <p className="muted">We’re here when you need help.</p>
                  </div>
                </div>
              </div>

              <button className="ui-btn primary" type="button">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section className="page-section soft">
        <div className="container">
          <div className="section-head">
            <h3>Why shop with us</h3>
            <p className="muted">Simple benefits that make shopping easier.</p>
          </div>

          <div className="offer-grid">
            <div className="offer-tile">
              <i className="fa-solid fa-cart-shopping" />
              <h5>Free Shipping</h5>
              <p className="muted">On order over $1000</p>
            </div>
            <div className="offer-tile">
              <i className="fa-solid fa-rotate-left" />
              <h5>Free Returns</h5>
              <p className="muted">Within 30 days</p>
            </div>
            <div className="offer-tile">
              <i className="fa-solid fa-truck" />
              <h5>Fast Delivery</h5>
              <p className="muted">Worldwide</p>
            </div>
            <div className="offer-tile">
              <i className="fa-solid fa-thumbs-up" />
              <h5>Big Choice</h5>
              <p className="muted">Of products</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="page-section">
        <div className="container">
          <div className="newsletter-card">
            <div>
              <h3>Subscribe for updates</h3>
              <p className="muted">New drops, deals, and product updates.</p>
            </div>

            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="ui-btn primary" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (full width background) */}
      <footer id="footer" className="footer-full">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 footer-contact">
                <h3>SwiftShop</h3>
                <p>
                  Karakum <br />
                  Kyrenia <br />
                  Cyprus <br />
                </p>
                <strong>Phone:</strong> +000000000000000 <br />
                <strong>Email:</strong> swiftshop@shop.com <br />
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Terms of service</a></li>
                  <li><a href="#">Privacy policy</a></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><a href="#">PS 5</a></li>
                  <li><a href="#">Computer</a></li>
                  <li><a href="#">Gaming Laptop</a></li>
                  <li><a href="#">Mobile Phone</a></li>
                  <li><a href="#">Gaming Gadget</a></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Our Social Networks</h4>
                <p>Follow SwiftShop for updates, new drops, and special offers.</p>
                <div className="socail-links mt-3">
                  <a href="#"><i className="fa-brands fa-twitter" /></a>
                  <a href="#"><i className="fa-brands fa-facebook-f" /></a>
                  <a href="#"><i className="fa-brands fa-instagram" /></a>
                  <a href="#"><i className="fa-brands fa-skype" /></a>
                  <a href="#"><i className="fa-brands fa-linkedin" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="container py-4">
          <div className="copyright">
            &copy; Copyright <strong>SwiftShop</strong>. All Rights Reserved
          </div>
          <div className="credits">
            Designed by <a href="#">SA coding</a>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP (fixed, never below footer) */}
      {showTop && (
        <button
          type="button"
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <img src="/images/arrow.png" alt="arrow" />
        </button>
      )}
    </>
  );
};

export default About;
