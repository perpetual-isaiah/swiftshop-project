import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - Uses API Gateway (no /api prefix needed!)
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const ensureLink = (id, href) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    const ensureScript = (id, src) => {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    // FontAwesome
    ensureLink(
      "fa-css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
    );

    // Google font (Merriweather)
    ensureLink(
      "merriweather-font",
      "https://fonts.googleapis.com/css2?family=Merriweather&display=swap"
    );

    // Bootstrap CSS
    ensureLink(
      "bootstrap-css",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
    );

    // Bootstrap JS bundle (dropdown + navbar toggler)
    ensureScript(
      "bootstrap-bundle",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    );

    // Fetch products from API
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Note: API Gateway routes at /products, not /api/products
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    purple: "rgb(67 0 86)",
    white: "#fff",
    text: "#111",
    muted: "#666",
    border: "#e6e6e6",
    soft: "#f6f7f8",
    shadow: "0 10px 30px rgba(0,0,0,0.08)",
  };

  const S = {
    page: {
      fontFamily: "'Merriweather', serif",
      background: "#ffffff",
      color: COLORS.text,
      minHeight: "100vh",
    },

    // Hero / home section
    homeSection: {
      padding: "26px 0 8px",
    },
    homeGrid: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 18px",
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: 18,
      alignItems: "center",
    },
    heroTitle: {
      margin: 0,
      fontSize: "clamp(26px, 3.2vw, 48px)",
      fontWeight: 900,
      lineHeight: 1.1,
    },
    heroP: {
      marginTop: 12,
      marginBottom: 0,
      color: COLORS.muted,
      fontSize: 14,
      lineHeight: 1.7,
      maxWidth: 560,
    },
    heroBtn: {
      marginTop: 16,
      border: "none",
      borderRadius: 10,
      padding: "12px 18px",
      fontWeight: 900,
      background: COLORS.purple,
      color: COLORS.white,
      cursor: "pointer",
      boxShadow: COLORS.shadow,
    },
    heroImg: {
      width: "100%",
      maxWidth: 560,
      height: "auto",
      display: "block",
      margin: "0 auto",
    },

    // Titles
    sectionTitle: {
      textAlign: "center",
      fontWeight: 900,
      letterSpacing: 0.6,
      margin: "24px 0 0",
    },

    // Stars
    starChecked: { color: "#ffc107" },

    // Overlay cards
    overlayWrap: { position: "relative", borderRadius: 12, overflow: "hidden" },
    overlay: {
      position: "absolute",
      inset: 0,
      padding: 18,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background:
        "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15))",
      color: "#fff",
    },
    overlayBtn: {
      marginTop: 10,
      width: "fit-content",
      border: "none",
      borderRadius: 10,
      padding: "10px 16px",
      fontWeight: 900,
      background: COLORS.purple,
      color: "#fff",
      cursor: "pointer",
    },

    // Banner section (same vibe as home)
    bannerSection: { padding: "26px 0 8px" },

    // Offer
    offerBox: {
      marginTop: 18,
      borderRadius: 14,
      background: COLORS.soft,
      border: `1px solid ${COLORS.border}`,
      padding: "16px 10px",
    },
    offerIcon: { fontSize: 28, color: COLORS.purple, marginBottom: 8 },

    // Newsletter
    newsletterBox: {
      marginTop: 22,
      borderRadius: 14,
      border: `1px solid ${COLORS.border}`,
      padding: 18,
      background: "#fff",
      boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    },
    newsletterRow: {
      marginTop: 12,
      display: "flex",
      gap: 10,
      justifyContent: "center",
      flexWrap: "wrap",
    },
    newsletterInput: {
      width: "min(430px, 90vw)",
      padding: "10px 12px",
      borderRadius: 10,
      border: `1px solid ${COLORS.border}`,
      outline: "none",
    },
    subscribeBtn: {
      border: "none",
      borderRadius: 10,
      padding: "10px 16px",
      fontWeight: 900,
      background: COLORS.purple,
      color: "#fff",
      cursor: "pointer",
    },

    // Footer
    footer: {
      marginTop: 26,
      background: COLORS.purple,
      color: "#fff",
      paddingTop: 26,
    },
    footerA: { color: "#fff", textDecoration: "none", opacity: 0.92 },
    footerHr: { borderColor: "rgba(255,255,255,0.25)" },
    socialA: {
      width: 34,
      height: 34,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      background: "rgba(255,255,255,0.12)",
      color: "#fff",
      textDecoration: "none",
    },

    // Scroll arrow
    arrowBtn: {
      position: "fixed",
      right: 16,
      bottom: 16,
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "#fff",
      border: `1px solid ${COLORS.border}`,
      boxShadow: COLORS.shadow,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 999,
    },
    arrowImg: { width: 26, height: 26 },

    // Loading
    loadingContainer: {
      textAlign: "center",
      padding: "50px 0",
      fontSize: 18,
      color: COLORS.muted,
    },

    // Error
    errorContainer: {
      textAlign: "center",
      padding: "50px 20px",
      fontSize: 16,
      color: "#d32f2f",
    },
  };

  const HERO_TEXT =
    "Welcome to SwiftShop — your trusted place for quality electronics at fair prices. From smartphones and laptops to home appliances and gaming gadgets, we carefully select products that are reliable, modern, and worth your money. Shop with confidence and enjoy a smooth experience from browsing to checkout.";

  const BANNER_TEXT =
    "SwiftShop brings you the latest gadgets and everyday electronics in one place. Discover new arrivals, enjoy special discounts, and upgrade your setup with products that match your lifestyle — whether it's work, entertainment, or home comfort.";

  const Stars = () => (
    <div className="star text-center">
      <i className="fa-solid fa-star" style={S.starChecked} />
      <i className="fa-solid fa-star" style={S.starChecked} />
      <i className="fa-solid fa-star" style={S.starChecked} />
      <i className="fa-solid fa-star" style={S.starChecked} />
      <i className="fa-solid fa-star" style={S.starChecked} />
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="col-md-3 py-3 py-md-0">
      <div 
        className="card" 
        style={{ 
          borderRadius: 12, 
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onClick={() => navigate("/products", { state: { focusProductId: product.id } })}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <img 
          src={product.image_url || "/images/placeholder.png"} 
          alt={product.name}
          style={{
            width: "100%",
            height: "250px",
            objectFit: "contain",
            backgroundColor: "#f8f9fa",
            padding: "10px"
          }}
          onError={(e) => {
            e.target.src = "/images/placeholder.png";
            console.error(`Failed to load image for ${product.name}: ${product.image_url}`);
          }}
        />
        <div className="card-body">
          <h3 className="text-center" style={{ fontWeight: 900, fontSize: "18px", marginBottom: "10px" }}>
            {product.name}
          </h3>
          <p className="text-center" style={{ fontSize: "14px", color: COLORS.muted, marginBottom: "10px" }}>
            {product.description}
          </p>
          <Stars />
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 900,
              fontSize: "20px",
              marginTop: "10px"
            }}
          >
            ${product.price.toFixed(2)}{" "}
            <span>
              <i className="fa-solid fa-cart-shopping" />
            </span>
          </h2>
        </div>
      </div>
    </div>
  );

  const OverlayCard = ({ img, h3, h5, p, showBtn }) => (
    <div className="col-md-6 py-3 py-md-0">
      <div className="card" style={S.overlayWrap}>
        <img src={img} alt={h3} />
        <div className="card-img-overlay" style={S.overlay}>
          <h3 style={{ margin: 0, fontWeight: 900 }}>{h3}</h3>
          {h5 ? (
            <h5 style={{ margin: "8px 0 0", fontWeight: 800 }}>{h5}</h5>
          ) : null}
          {p ? <p style={{ margin: "8px 0 0", fontWeight: 700 }}>{p}</p> : null}
          {showBtn ? <button style={S.overlayBtn}>Shop Now</button> : null}
        </div>
      </div>
    </div>
  );

  const SmallOverlayCard = ({ img, title, text }) => (
    <div className="col-md-4 py-3 py-md-0">
      <div className="card" style={S.overlayWrap}>
        <img src={img} alt={title} />
        <div className="card-img-overlay" style={S.overlay}>
          <h3 style={{ margin: 0, fontWeight: 900 }}>{title}</h3>
          <p style={{ margin: "8px 0 0", fontWeight: 700 }}>{text}</p>
        </div>
      </div>
    </div>
  );

  // Split products by their original positions (based on order in DB)
  const getProductsByRange = (start, end) => {
    return products.slice(start, end);
  };

  if (loading) {
    return (
      <div style={S.page}>
        <div style={S.loadingContainer}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, color: COLORS.purple }}></i>
          <p style={{ marginTop: 16 }}>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.page}>
        <div style={S.errorContainer}>
          <i className="fa-solid fa-exclamation-circle" style={{ fontSize: 32 }}></i>
          <p style={{ marginTop: 16 }}>{error}</p>
          <button style={S.heroBtn} onClick={fetchProducts}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{`
        @media (max-width: 992px){
          .home-grid { grid-template-columns: 1fr !important; }
        }
        a:hover { opacity: 0.95; }
      `}</style>

      {/* HOME CONTENT */}
      <section className="home" style={S.homeSection}>
        <div className="home-grid" style={S.homeGrid}>
          <div className="content">
            <h1 style={S.heroTitle}>
              <span>Electronic Products</span>
              <br />
              Up To <span id="span2" style={{ color: COLORS.purple }}>50%</span>{" "}
              Off
            </h1>

            <p style={S.heroP}>{HERO_TEXT}</p>

            <div className="btn" style={{ marginTop: 14 }}>
              <button
                style={S.heroBtn}
                onClick={() => navigate("/products")}

              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="img">
            <img src="/images/background.png" alt="hero" style={S.heroImg} />
          </div>
        </div>
      </section>

      {/* PRODUCT CARDS (FIRST SET - Products 0-7) */}
      <div className="container" id="product-cards">
        <h1 className="text-center" style={S.sectionTitle}>
          PRODUCTS
        </h1>

        <div className="row" style={{ marginTop: 30 }}>
          {getProductsByRange(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="row" style={{ marginTop: 30 }}>
          {getProductsByRange(4, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* OTHER CARDS (2 big overlays) */}
      <div className="container" id="other-cards">
        <div className="row">
          <OverlayCard
            img="/images/c1.png"
            h3="Best Laptop"
            h5="Latest Collection"
            p="Up To 50% Off"
            showBtn
          />
          <OverlayCard
            img="/images/c2.png"
            h3="Best Headphone"
            h5="Latest Collection"
            p="Up To 50% Off"
            showBtn
          />
        </div>
      </div>

      {/* BANNER */}
      <section className="banner" style={S.bannerSection}>
        <div className="home-grid" style={S.homeGrid}>
          <div className="content">
            <h1 style={S.heroTitle}>
              <span>Smart Gadgets</span>
              <br />
              Up To <span id="span2" style={{ color: COLORS.purple }}>50%</span>{" "}
              Off
            </h1>

            <p style={S.heroP}>{BANNER_TEXT}</p>

            <div className="btn" style={{ marginTop: 14 }}>
              <button
                style={S.heroBtn}
                onClick={() => navigate("/products")}

              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="img">
            <img src="/images/image1.png" alt="banner" style={S.heroImg} />
          </div>
        </div>
      </section>

      {/* PRODUCT CARDS (SECOND SET - Products 8-11) */}
      <div className="container" id="product-cards">
        <div className="row" style={{ marginTop: 30 }}>
          {getProductsByRange(8, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* OTHER (3 small overlay cards) */}
        <div className="container" id="other">
          <div className="row">
            <SmallOverlayCard
              img="/images/c3.png"
              title="Home Gadgets"
              text="Latest collection — Up To 50% Off"
            />
            <SmallOverlayCard
              img="/images/c4.png"
              title="Gaming Gadgets"
              text="Latest collection — Up To 50% Off"
            />
            <SmallOverlayCard
              img="/images/c5.png"
              title="Accessories"
              text="Latest collection — Up To 50% Off"
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: 30 }}>
          {getProductsByRange(12, 16).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="row" style={{ marginTop: 30 }}>
          {getProductsByRange(16, 20).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* OFFER */}
      <div className="container" id="offer">
        <div style={S.offerBox}>
          <div className="row">
            <div className="col-md-3 py-3 py-md-0 text-center">
              <i className="fa-solid fa-cart-shopping" style={S.offerIcon} />
              <h3 style={{ fontWeight: 900 }}>Free Shipping</h3>
              <p style={{ margin: 0, color: COLORS.muted }}>
                On orders over $1000
              </p>
            </div>

            <div className="col-md-3 py-3 py-md-0 text-center">
              <i className="fa-solid fa-rotate-left" style={S.offerIcon} />
              <h3 style={{ fontWeight: 900 }}>Free Returns</h3>
              <p style={{ margin: 0, color: COLORS.muted }}>Within 30 days</p>
            </div>

            <div className="col-md-3 py-3 py-md-0 text-center">
              <i className="fa-solid fa-truck" style={S.offerIcon} />
              <h3 style={{ fontWeight: 900 }}>Fast Delivery</h3>
              <p style={{ margin: 0, color: COLORS.muted }}>Worldwide</p>
            </div>

            <div className="col-md-3 py-3 py-md-0 text-center">
              <i className="fa-solid fa-thumbs-up" style={S.offerIcon} />
              <h3 style={{ fontWeight: 900 }}>Big Choice</h3>
              <p style={{ margin: 0, color: COLORS.muted }}>Of products</p>
            </div>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="container" id="newslater">
        <div style={S.newsletterBox}>
          <h3 className="text-center" style={{ fontWeight: 900, margin: 0 }}>
            Subscribe to SwiftShop for new arrivals and deals.
          </h3>
          <div className="input text-center" style={S.newsletterRow}>
            <input
              type="text"
              placeholder="Enter Your Email.."
              style={S.newsletterInput}
            />
            <button id="subscribe" style={S.subscribeBtn}>
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer id="footer" style={S.footer}>
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 footer-contact">
                <h3 style={{ fontWeight: 900 }}>SwiftShop</h3>
                <p style={{ marginBottom: 10 }}>
                  Karachi <br />
                  Sindh <br />
                  Pakistan <br />
                </p>
                <strong>Phone:</strong> +000000000000000 <br />
                <strong>Email:</strong> swiftshop@shop.com <br />
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4 style={{ fontWeight: 900 }}>Useful Links</h4>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  <li>
                    <a href="#" style={S.footerA}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Terms of service
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Privacy policy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4 style={{ fontWeight: 900 }}>Our Services</h4>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  <li>
                    <a href="#" style={S.footerA}>
                      PS5
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Computer
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Gaming Laptop
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Mobile Phone
                    </a>
                  </li>
                  <li>
                    <a href="#" style={S.footerA}>
                      Gaming Accessories
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4 style={{ fontWeight: 900 }}>Our Social Networks</h4>
                <p style={{ opacity: 0.9 }}>
                  Follow SwiftShop for updates, new drops, and special offers.
                </p>

                <div
                  className="socail-links mt-3"
                  style={{ display: "flex", gap: 10 }}
                >
                  <a href="#" style={S.socialA}>
                    <i className="fa-brands fa-twitter" />
                  </a>
                  <a href="#" style={S.socialA}>
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                  <a href="#" style={S.socialA}>
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a href="#" style={S.socialA}>
                    <i className="fa-brands fa-skype" />
                  </a>
                  <a href="#" style={S.socialA}>
                    <i className="fa-brands fa-linkedin" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr style={S.footerHr} />

        <div className="container py-4" style={{ color: "#fff" }}>
          <div className="copyright" style={{ fontWeight: 700 }}>
            &copy; Copyright <strong><span>SwiftShop</span></strong>. All Rights
            Reserved
          </div>
          <div className="credits" style={{ opacity: 0.9 }}>
            Designed by <a href="#" style={S.footerA}>SA coding</a>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP ARROW */}
      <button
        type="button"
        style={S.arrowBtn}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <img src="/images/arrow.png" alt="arrow" style={S.arrowImg} />
      </button>
    </div>
  );
};

export default Home;