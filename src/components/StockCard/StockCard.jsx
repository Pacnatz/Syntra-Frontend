import "./StockCard.css";

function StockCard({ symbol, description }) {
  return (
    <li className="stock-card">
      <h3 className="stock-card__name">{symbol}</h3>
      <p className="stock-card__description">{description}</p>
    </li>
  );
}

export default StockCard;
