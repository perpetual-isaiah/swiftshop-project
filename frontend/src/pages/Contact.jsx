import React, { useEffect, useState } from "react";

const Contact = () => {
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
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Have a question? Send a message and we’ll get back to you.
          </p>
        </div>
      </section>

      {/* CARDS + FORM */}
      <section className="page-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-card">
                <i className="fa-solid fa-phone" />
                <div>
                  <h5>Phone</h5>
                  <p className="muted">+0000000000000000000</p>
                </div>
              </div>

              <div className="info-card">
                <i className="fa-solid fa-envelope" />
                <div>
                  <h5>Email</h5>
                  <p className="muted">swiftshop@shop.com</p>
                </div>
              </div>

              <div className="info-card">
                <i className="fa-solid fa-location-dot" />
                <div>
                  <h5>Address</h5>
                  <p className="muted">Karakum, Kyrenia, Cyprus</p>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <h3>Send a message</h3>
              <p className="muted" style={{ marginBottom: 14 }}>
                We usually respond within 24 hours.
              </p>

              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Name" />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" placeholder="Email" />
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" placeholder="Phone" />
                </div>
                <div className="col-md-12">
                  <textarea className="form-control" rows="5" placeholder="Message" />
                </div>
                <div className="col-md-12">
                  <button className="ui-btn primary" type="button" style={{ width: "100%" }}>
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div style={{ marginTop: 28 }}>
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
                  Karachi <br />
                  Sindh <br />
                  Pakistan <br />
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

export default Contact;
