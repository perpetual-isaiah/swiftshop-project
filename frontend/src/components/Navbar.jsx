import React, { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();

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

    ensureLink(
      "fa-css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
    );
    ensureLink(
      "merriweather-font",
      "https://fonts.googleapis.com/css2?family=Merriweather&display=swap"
    );
    ensureLink(
      "bootstrap-css",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
    );
    ensureScript(
      "bootstrap-bundle",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    );
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Base active class for links
  const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  // ✅ Make "Product" active for BOTH:
  // /products and /products?category=...
  const isProductsRoute = location.pathname === "/products";

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="top-navbar">
        <p>WELCOME TO OUR SHOP</p>

        <div className="icons">
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="topnav-link">
                <img src="/images/register.png" alt="profile" width="18" />
                Profile
              </NavLink>

              <button type="button" className="topnav-btn" onClick={handleLogout}>
                <img src="/images/register.png" alt="logout" width="18" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="topnav-link">
                <img src="/images/register.png" alt="login" width="18" />
                Login
              </NavLink>

              <NavLink to="/register" className="topnav-link">
                <img src="/images/register.png" alt="register" width="18" />
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg" id="navbar">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/" id="logo">
            <span id="span1">S</span>wift<span>Shop</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span>
              <img src="/images/menu.png" alt="menu" width="30" />
            </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Home */}
              <li className="nav-item">
                <NavLink to="/" end className={navClass}>
                  Home
                </NavLink>
              </li>

              {/* Products (stays active even with ?category=...) */}
              <li className="nav-item">
                <NavLink
                  to="/products"
                  className={() => (isProductsRoute ? "nav-link active" : "nav-link")}
                >
                  Product
                </NavLink>
              </li>

              {/* Category dropdown (optional: keep styled like nav-link) */}
              <li className="nav-item dropdown">
                <span
                  className={`nav-link dropdown-toggle ${isProductsRoute ? "active" : ""}`}
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer" }}
                >
                  Category
                </span>

                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {[
                    "Smart Phone",
                    "Mobile Phone",
                    "Cameras",
                    "Fridge",
                    "AC",
                    "Smart Watch",
                    "Headphone",
                    "Laptop",
                    "PC Monitor",
                  ].map((c) => (
                    <li key={c}>
                      <NavLink
                        className="dropdown-item"
                        to={`/products?category=${encodeURIComponent(c)}`}
                      >
                        {c}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Cart */}
              <li className="nav-item">
                <NavLink to="/cart" className={navClass}>
                  Cart <i className="fa-solid fa-cart-shopping" />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </NavLink>
              </li>

              {/* Logged-in links */}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <NavLink to="/orders" className={navClass}>
                      My Orders
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard" className={navClass}>
                      Dashboard
                    </NavLink>
                  </li>
                </>
              )}

              {/* About */}
              <li className="nav-item">
                <NavLink to="/about" className={navClass}>
                  About
                </NavLink>
              </li>

              {/* Contact */}
              <li className="nav-item">
                <NavLink to="/contact" className={navClass}>
                  Contact
                </NavLink>
              </li>
            </ul>

            <form className="d-flex" id="search" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
