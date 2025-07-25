import React, { useState, useEffect } from "react";

export default function HandInput({ hand, setHand }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/cards/search?q=${inputValue}`);
        const data = await res.json();
        setSuggestions(data.cards || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleAddCard = (card) => {
    if (!hand.includes(card)) {
      setHand([...hand, card]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const handleRemoveCard = (card) => {
    setHand(hand.filter((c) => c !== card));
  };

  return (
    <div>
      <label>Hand:</label>
      <input
        type="text"
        placeholder="Search card..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul style={{ border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto" }}>
          {suggestions.map((name) => (
            <li
              key={name}
              style={{ cursor: "pointer", padding: "4px" }}
              onClick={() => handleAddCard(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: "10px" }}>
        {hand.map((card) => (
          <span
            key={card}
            style={{
              padding: "5px",
              margin: "5px",
              border: "1px solid #aaa",
              display: "inline-block",
              cursor: "pointer"
            }}
            onClick={() => handleRemoveCard(card)}
          >
            {card} ✕
          </span>
        ))}
      </div>
    </div>
  );
}
