import React, { useState } from "react";

export default function HandInput({ hand, setHand }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // --- Fetch matching cards from backend ---
  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/cards/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data.cards || []);
    } catch (err) {
      console.error("Error fetching card suggestions:", err);
    }
  };

  // --- Add card to hand ---
  const addCard = (cardName) => {
    if (!hand.includes(cardName)) {
      setHand([...hand, cardName]);
    }
    setQuery("");
    setSuggestions([]);
  };

  // --- Remove card from hand ---
  const removeCard = (cardName) => {
    setHand(hand.filter((card) => card !== cardName));
  };

  return (
    <div>
      <label htmlFor="card-search">Search Cards:</label>
      <input
        id="card-search"
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Type card name..."
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul style={{ border: "1px solid #ccc", padding: 0, margin: 0, listStyle: "none" }}>
          {suggestions.map((card, idx) => (
            <li
              key={idx}
              style={{ padding: "4px", cursor: "pointer" }}
              onClick={() => addCard(card)}
            >
              {card}
            </li>
          ))}
        </ul>
      )}

      <h4>Hand:</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {hand.map((card, idx) => (
          <li
            key={idx}
            style={{
              cursor: "pointer",
              display: "inline-block",
              margin: "4px",
              padding: "4px 8px",
              border: "1px solid #aaa",
              borderRadius: "4px",
              background: "#f0f0f0",
            }}
            onClick={() => removeCard(card)}
            title="Click to remove"
          >
            {card} ×
          </li>
        ))}
      </ul>
    </div>
  );
}

