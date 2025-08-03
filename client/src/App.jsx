import React, { useEffect } from "react";
import ManaForm from "./components/ManaForm";
import "./style.css";

import logo from "./assets/Mana BANK.png"; 

export default function App() {
  useEffect(() => {
    const handleMove = (e) => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      const size = 5; 
      sparkle.style.left = `${e.clientX - size / 2}px`;
      sparkle.style.top = `${e.clientY - size / 2}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 500);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

 return (
  <div className="app-container">
    <h1>
      <img src={logo} alt="ManaBANK logo" height="480" />
    </h1>
    <ManaForm />
  </div>
);

}
