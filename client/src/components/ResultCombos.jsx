import React from "react";

// Same compress logic but on frontend
function compressMana(manaArray) {
  const counts = manaArray.reduce((acc, symbol) => {
    acc[symbol] = (acc[symbol] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([symbol, count]) => (count > 1 ? `${count}${symbol}` : symbol))
    .join(" ");
}

export default function ResultCombos({ combos }) {
  if (!combos || combos.length === 0) {
    return <p>No playable combos found.</p>;
  }

  return (
    <div>
      <h3>Playable Combos</h3>
      <ul>
        {combos.map((combo, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            <strong>Cards:</strong> {combo.cards.join(", ")} <br />
            <strong>Mana Used:</strong> {compressMana(combo.manaUsed)} <br />
            <strong>Remaining Mana:</strong> {compressMana(combo.remainingMana)}
          </li>
        ))}
      </ul>
    </div>
  );
}
