import React from "react";

const ManaSymbols = ["W", "U", "B", "R", "G", "C", "generic"];

export default function ManaInput({ manaPool, setManaPool }) {
  const handleChange = (symbol, value) => {
    setManaPool({ ...manaPool, [symbol]: Number(value) || 0 });
  };

  return (
    <div>
      <h3>Mana Pool</h3>
      {ManaSymbols.map((symbol) => (
        <div key={symbol}>
          <label>{symbol}: </label>
          <input
            type="number"
            min="0"
            value={manaPool[symbol]}
            onChange={(e) => handleChange(symbol, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

