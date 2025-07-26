import React, { useState } from "react";
import ManaInput from "./ManaInput";
import HandInput from "./HandInput";
import ResultCombos from "./ResultCombos";

export default function ManaForm() {
  // --- Mana pool as structured object ---
  const [manaPool, setManaPool] = useState({
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
    C: 0,
    Generic: 0,
  });

  // --- Hand as array ---
  const [hand, setHand] = useState([]);
  const [combos, setCombos] = useState([]);

  // --- Submit handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/combo-castable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manaPool,  // structured mana pool
          hand,      // array of card names
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      const data = await res.json();
      setCombos(data.combos || []);
    } catch (err) {
      console.error("Error fetching combos:", err);
      setCombos([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter Mana</h3>
      <ManaInput manaPool={manaPool} setManaPool={setManaPool} />

      <h3>Search & Add Cards to Hand</h3>
      <HandInput hand={hand} setHand={setHand} />

      <button type="submit" style={{ marginTop: "1rem" }}>
        Submit
      </button>

      <ResultCombos combos={combos} />
    </form>
  );
}
