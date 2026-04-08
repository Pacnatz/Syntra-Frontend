import SearchIcon from "../../assets/SearchIcon.svg";
import "./SearchBar.css";

function SearchBar() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit} className="searchbar">
      <img src={SearchIcon} alt="Search Icon" className="searchbar__icon" />
      <input
        id="search"
        type="text"
        aria-label="Search"
        placeholder="Search..."
        className="searchbar__input"
      />
    </form>
  );
}

export default SearchBar;
