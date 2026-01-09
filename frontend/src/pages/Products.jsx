import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { productAPI } from "../services/productService";
import { useCart } from "../context/CartContext";

// Use images from public folder
const iphoneImg = "/images/p6.png";
const airpodsImg = "/images/a1.png";
const laptopImg = "/images/laptop2.png";
const ipadImg = "/images/t1.png";
const watchImg = "/images/w1.png";
const monitorImg = "/images/pcm1.png";
const iphoneXImg = "/images/phone1.png";
const headphoneImg = "/images/h1.png";
const washingImg = "/images/pr1.png";
const acImg = "/images/pr2.png";
const microwaveImg = "/images/pr3.png";
const fridgeImg = "/images/pr4.png";
const fanImg = "/images/pr5.png";
const fridgeLargeImg = "/images/pr6.png";
const gamingPcImg = "/images/pr7.png";
const monitorAltImg = "/images/pr8.png";
const watchSportImg = "/images/pr9.png";
const powerBankImg = "/images/pr10.png";
const mouseImg = "/images/pr11.png";
const joysticksImg = "/images/pr12.png";

// Map product names to local images
const LOCAL_IMAGES = {
  "iphone 13 pro": iphoneImg,
  airpods: airpodsImg,
  laptop: laptopImg,
  ipad: ipadImg,
  "smart watch": watchImg,
  "pc monitor": monitorImg,
  "iphone x": iphoneXImg,
  headphone: headphoneImg,
  "washing machine": washingImg,
  "washion machine": washingImg, // typo variant
  ac: acImg,
  "microwave oven": microwaveImg,
  microwave: microwaveImg,
  "fridge (large)": fridgeLargeImg,
  fridge: fridgeImg,
  fan: fanImg,
  "gaming pc": gamingPcImg,
  monitor: monitorAltImg,
  moniter: monitorAltImg, // typo variant
  "smart watch (sport)": watchSportImg,
  "power bank": powerBankImg,
  "gaming mouse": mouseImg,
  joysticks: joysticksImg,
};

const getProductImage = (product) => {
  // If product has a valid image URL, use it
  if (product.image && product.image.startsWith("http")) {
    return product.image;
  }

  // Try to match product name with local images
  const name = (product.name || "").toLowerCase().trim();

  // First try exact match
  if (LOCAL_IMAGES[name]) {
    return LOCAL_IMAGES[name];
  }

  // Then try partial match
  for (const [key, imageUrl] of Object.entries(LOCAL_IMAGES)) {
    const firstWord = name.split(" ")[0];
    if (name.includes(key) || key.includes(firstWord)) {
      return imageUrl;
    }
  }

  // Fallback
  return iphoneImg;
};

const Products = () => {
  const location = useLocation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ---- focus/scroll support ----
  const focusProductId = useMemo(() => {
    const raw = location?.state?.focusProductId;
    if (raw === undefined || raw === null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw; // supports numeric or string ids
  }, [location?.state?.focusProductId]);

  const itemRefs = useRef(new Map());
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // After products are loaded, scroll to focused product (if any)
    if (loading) return;
    if (!focusProductId) return;
    if (!products || products.length === 0) return;

    const el = itemRefs.current.get(String(focusProductId));
    if (!el) return;

    // smooth scroll + temporary highlight
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightId(String(focusProductId));

    const t = setTimeout(() => setHighlightId(null), 1800);
    return () => clearTimeout(t);
  }, [loading, focusProductId, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productAPI.getAllProducts();
      const productsArray = Array.isArray(data) ? data : data.products || data.data || [];
      setProducts(productsArray);
    } catch (err) {
      if (err.response?.status === 503) setError("Product Service is not yet available.");
      else setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await productAPI.searchProducts(searchQuery);
      const productsArray = Array.isArray(data) ? data : data.products || data.data || [];
      setProducts(productsArray);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(product),
      quantity: 1,
    });
  };

  return (
    <div className="ui-shell">
      {/* tiny highlight style (only affects this page) */}
      <style>{`
        .product-tile.is-focused {
          outline: 3px solid rgba(67, 0, 86, 0.35);
          box-shadow: 0 18px 40px rgba(67, 0, 86, 0.18);
          transform: translateY(-2px);
          transition: 0.25s ease;
        }
      `}</style>

      <div className="ui-card">
        <div className="ui-card-header">
          <div>
            <h2>🛍️ Products</h2>
            <p className="ui-muted">Discover our latest electronics and gadgets.</p>
          </div>

          <button className="ui-btn secondary" onClick={loadProducts} type="button">
            🔄 Refresh
          </button>
        </div>

        <form className="ui-search" onSubmit={handleSearch}>
          <span>🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
          />
        </form>

        {error && <div className="ui-alert error">❌ {error}</div>}

        <div className="ui-card-body">
          {loading ? (
            <div className="ui-center ui-muted" style={{ padding: 18 }}>
              ⏳ Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="ui-center" style={{ padding: 18 }}>
              <div style={{ fontSize: 40 }}>📦</div>
              <h3 style={{ fontWeight: 900, marginTop: 6 }}>No products found</h3>
              <p className="ui-muted">Try searching something else or refresh.</p>
              <button className="ui-btn primary" onClick={loadProducts} type="button">
                Reload
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => {
                const pid = String(p.id ?? "");
                const focused = highlightId && highlightId === String(focusProductId) && pid === String(focusProductId);

                return (
                  <div
                    className={`product-tile ${focused ? "is-focused" : ""}`}
                    key={p.id}
                    ref={(node) => {
                      if (!pid) return;
                      if (node) itemRefs.current.set(pid, node);
                      else itemRefs.current.delete(pid);
                    }}
                  >
                    <div className="product-media">
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<div style="font-size: 54px">📦</div>';
                        }}
                      />
                    </div>

                    <div className="product-body">
                      <h3 className="product-title">{p.name}</h3>
                      <p className="product-desc">{p.description || "No description available."}</p>

                      <div className="product-row">
                        <div>
                          <div className="product-price">${Number(p.price ?? 0).toFixed(2)}</div>
                          <div className="product-meta">ID: {p.id}</div>
                        </div>

                        <button
                          className="ui-btn primary"
                          disabled={p.stock === 0}
                          onClick={() => handleAddToCart(p)}
                          type="button"
                        >
                          {p.stock === 0 ? "🚫 Unavailable" : "🛒 Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
