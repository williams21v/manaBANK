import React, { useState } from "react";

export default function HandInput({ hand, setHand, addCard }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchCards = async (q) => {
    setQuery(q);
    if (q.length < 2) return setResults([]);
    const res = await fetch(`http://localhost:3001/api/cards/search?q=${q}`);
    const data = await res.json();
    setResults(data.cards || []);
  };

  const handleAddCard = (card) => {
    addCard(card);
    setQuery("");
    setResults([]);
  };

  return (
    <div>
      <label>Search Cards:</label>
      <input
        type="text"
        value={query}
        onChange={(e) => searchCards(e.target.value)}
        placeholder="Type card name"
      />
      {results.length > 0 && (
        <ul style={{ border: "1px solid gray", padding: "5px", listStyle: "none" }}>
          {results.map((card, idx) => (
            <li key={idx} style={{ cursor: "pointer" }} onClick={() => handleAddCard(card)}>
              {card}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
