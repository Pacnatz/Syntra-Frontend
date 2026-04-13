import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SearchContext from "../../context/SearchContext";
import SearchIcon from "../../assets/SearchIcon.svg";
import "./SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSearchResult, setSearchLoading } = useContext(SearchContext);

  const [previousPath, setPreviousPath] = useState(location.pathname);
  const debounceTimeoutRef = useRef(null);
  const debounceDelay = 1000; // Delay in milliseconds

  const onChange = (e) => {
    const query = e.target.value;
    if (query.length < 2) {
      // Go back to previous route
      clearTimeout(debounceTimeoutRef.current);
      setTimeout(() => {
        setSearchLoading(false);
      }, 20); // Small delay before setting switching back to previousPath
      navigate(previousPath);
      return;
    }
    setSearchLoading(true);

    // Update the URL with the search query as a parameter (Purely cosmetic)
    navigate("/dashboard/search?q=" + encodeURIComponent(query.trim()), {
      replace: true,
    });
    // If our path isn't already dashboard/search/
    location.pathname !== "/dashboard/search"
      ? setPreviousPath(location.pathname) // This will set previous path on the 2nd character input
      : null;

    // Debounce the search input to avoid excessive API calls
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      fetch(
        "http://localhost:3001/search?q=" + encodeURIComponent(query.trim()),
      )
        .then((res) =>
          res.ok ? res.json() : Promise.reject({ status: res.status }),
        )
        .then((data) => {
          setSearchResult(data);
        })
        .catch((error) => {
          console.error("Error fetching from server:", error);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, debounceDelay);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <form className="searchbar">
      <img
        src={SearchIcon}
        alt="Search Icon"
        className="searchbar__icon"
        draggable={false}
      />
      <input
        id="search"
        type="text"
        aria-label="Search"
        placeholder="Search..."
        className="searchbar__input"
        onChange={onChange}
      />
    </form>
  );
}

export default SearchBar;
