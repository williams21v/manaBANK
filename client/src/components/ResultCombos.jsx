import React from "react";

export default function ResultCombos({ combos }) {
  return (
    <div>
      <h3>Playable Combos</h3>
      {combos.length === 0 ? (
        <p>No playable combos found.</p>
      ) : (
        <ul>
          {combos.map((combo, idx) => (
            <li key={idx}>
              <strong>Cards:</strong> {combo.cards.join(", ")}<br />
              <strong>Mana Used:</strong> {combo.manaUsed}<br />
              <strong>Remaining Mana:</strong> {combo.remainingMana}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

