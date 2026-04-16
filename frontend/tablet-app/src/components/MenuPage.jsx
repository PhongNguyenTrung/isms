import { useEffect, useRef, useState } from 'react';
import { getMenu } from '../api/menu';
import { getTableBill } from '../api/orders';
import { useCart } from '../context/CartContext';
import MenuCard from './MenuCard';
import CartDrawer from './CartDrawer';
import BillDrawer from './BillDrawer';

const CATEGORY_ORDER = ['MAIN_DISH', 'APPETIZER', 'BEVERAGE', 'DESSERT'];
const CATEGORY_LABELS = {
  MAIN_DISH: 'Lẩu',
  APPETIZER: 'Nguyên liệu nhúng',
  BEVERAGE: 'Đồ uống',
  DESSERT: 'Tráng miệng',
};

export default function MenuPage({ tableId, onOrderSuccess }) {
  const { itemCount } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Active orders badge
  const [hasActiveOrders, setHasActiveOrders] = useState(false);
  const billPollRef = useRef(null);

  // Category nav
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);
  const sectionRefs = useRef({});

  useEffect(() => {
    getMenu()
      .then(setMenuItems)
      .catch(() => setError('Không thể tải menu. Vui lòng thử lại.'))
      .finally(() => setLoading(false));

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Poll bill to detect active orders → show badge on 🧾
  useEffect(() => {
    const check = async () => {
      try {
        const data = await getTableBill(tableId);
        const active = data?.orders?.some(
          (o) => !['COMPLETED', 'CANCELLED'].includes(o.status)
        );
        setHasActiveOrders(!!active);
        if (!active) {
          clearInterval(billPollRef.current);
          billPollRef.current = null;
        }
      } catch {
        // silent
      }
    };

    check();
    billPollRef.current = setInterval(check, 8000);
    return () => clearInterval(billPollRef.current);
  }, [tableId]);

  // Track scroll to highlight active category pill
  useEffect(() => {
    if (menuItems.length === 0) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY + 130;
      let current = CATEGORY_ORDER[0];
      CATEGORY_ORDER.forEach((cat) => {
        const el = sectionRefs.current[cat];
        if (el && el.offsetTop <= scrollTop) current = cat;
      });
      setActiveCategory(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  const showToast = (item) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(item);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const scrollToCategory = (cat) => {
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = menuItems.filter((m) => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const knownCats = new Set(CATEGORY_ORDER);
  menuItems.forEach((m) => {
    if (!knownCats.has(m.category)) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    }
  });

  const availableCats = CATEGORY_ORDER.filter((cat) => grouped[cat]);

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="header-left">
          <span className="header-logo">
            <span className="header-logo-icon">🍲</span>
            Haidilao
          </span>
        </div>
        <div className="header-right">
          <span className="header-user">Bàn {tableId}</span>
          <button className="btn-bill" onClick={() => setShowBill(true)}>
            🧾
            {hasActiveOrders && <span className="bill-badge" />}
          </button>
          <button className="btn-cart" onClick={() => setShowCart(true)}>
            🛒
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      {!loading && !error && availableCats.length > 0 && (
        <nav className="category-nav">
          {availableCats.map((cat) => (
            <button
              key={cat}
              className={`category-nav-pill${activeCategory === cat ? ' category-nav-pill--active' : ''}`}
              onClick={() => scrollToCategory(cat)}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </nav>
      )}

      <main className="menu-main">
        {loading && <div className="loading">Đang tải menu...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && Object.entries(grouped).map(([cat, items]) => (
          <section
            key={cat}
            className="menu-section"
            ref={(el) => { sectionRefs.current[cat] = el; }}
          >
            <h2 className="section-title">
              {CATEGORY_LABELS[cat] || cat}
            </h2>
            <div className="menu-grid">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} onAdd={showToast} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className={`toast${toast ? ' toast--visible' : ''}`}>
        <span className="toast-check">✓</span>
        Đã thêm <strong>{toast?.name_vi}</strong>
      </div>

      {showCart && (
        <CartDrawer
          tableId={tableId}
          onClose={() => setShowCart(false)}
          onOrderSuccess={(order) => {
            setShowCart(false);
            onOrderSuccess(order);
          }}
        />
      )}

      {showBill && (
        <BillDrawer
          tableId={tableId}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  );
}
