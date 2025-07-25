import React, { useState } from "react";
import ManaInput from "./ManaInput";
import HandInput from "./HandInput";
import ResultCombos from "./ResultCombos";

export default function ManaForm() {
  const [manaPool, setManaPool] = useState({ W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 });
  const [hand, setHand] = useState([]);
  const [combos, setCombos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const manaArray = [];
    Object.keys(manaPool).forEach(color => {
      for (let i = 0; i < manaPool[color]; i++) {
        manaArray.push(color);
      }
    });

    const res = await fetch("http://localhost:3001/api/combo-castable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manaPool: manaArray, hand }),
    });

    const data = await res.json();
    setCombos(data.combos || []);
  };

  const removeCard = (cardToRemove) => {
    setHand(prev => prev.filter(c => c !== cardToRemove));
  };

  const addCard = (newCard) => {
    if (!hand.includes(newCard)) {
      setHand(prev => [...prev, newCard]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ManaInput manaPool={manaPool} setManaPool={setManaPool} />
      <HandInput hand={hand} setHand={setHand} addCard={addCard} />
      <div>
        <h4>Hand (click to remove):</h4>
        {hand.map((card, idx) => (
          <span 
            key={idx} 
            style={{ marginRight: "10px", cursor: "pointer", color: "blue" }}
            onClick={() => removeCard(card)}
          >
            {card}
          </span>
        ))}
      </div>
      <button type="submit">Submit</button>
      <ResultCombos combos={combos} />
    </form>
  );
}
