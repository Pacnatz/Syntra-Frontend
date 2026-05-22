import "./WatchlistToggle.css";

function WatchlistToggle({ handleToggle }) {
  return (
    <label htmlFor="watchlist-toggle" className="watchlist-toggle">
      <input
        type="checkbox"
        id="watchlist-toggle"
        className="watchlist-toggle__checkbox"
        onChange={handleToggle}
      />
      <span className="watchlist-toggle__signup-text">Watchlist</span>
      <span className="watchlist-toggle__login-text">Friends</span>
      <span className="watchlist-toggle__slider"></span>
    </label>
  );
}

export default WatchlistToggle;
