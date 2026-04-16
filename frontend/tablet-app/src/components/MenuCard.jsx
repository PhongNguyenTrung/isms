import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CATEGORY_LABELS = {
  MAIN_DISH: 'Lẩu',
  BEVERAGE: 'Đồ uống',
  APPETIZER: 'Nguyên liệu nhúng',
  DESSERT: 'Tráng miệng',
};

const CATEGORY_ICONS = {
  MAIN_DISH: '🍲',
  APPETIZER: '🥩',
  BEVERAGE: '🍵',
  DESSERT: '🍮',
};

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

export default function MenuCard({ item, onAdd }) {
  const [imgError, setImgError] = useState(false);
  const { addItem, items } = useCart();

  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        {item.image_url && !imgError ? (
          <img
            src={item.image_url}
            alt={item.name_vi}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="menu-card-image-fallback">
            {CATEGORY_ICONS[item.category] || '🍽️'}
          </div>
        )}
      </div>
      <div className="menu-card-body">
        <div className="menu-card-category">
          {CATEGORY_LABELS[item.category] || item.category}
        </div>
        <h3 className="menu-card-name">{item.name_vi}</h3>
        <p className="menu-card-name-en">{item.name_en}</p>
        {item.description && (
          <p className="menu-card-desc">{item.description}</p>
        )}
        <div className="menu-card-footer">
          <span className="menu-card-price">{formatPrice(item.price)}</span>
          <button
            className={`btn-add ${qtyInCart > 0 ? 'btn-add--active' : ''}`}
            onClick={() => { addItem(item); onAdd?.(item); }}
          >
            {qtyInCart > 0 ? `+1 (${qtyInCart})` : '+ Thêm'}
          </button>
        </div>
      </div>
    </div>
  );
}
