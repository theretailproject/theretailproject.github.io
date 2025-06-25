import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadConfettiPreset } from "tsparticles-preset-confetti";
import "./popup.scss";

const Popup = ({ message = "Product added!", onClose }) => {
  const [show, setShow] = useState(true);

  const particlesInit = async (engine) => {
    await loadConfettiPreset(engine);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="popup-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          preset: "confetti",
          fullScreen: { enable: true, zIndex: 99 },
        }}
      />
      <div className="popup-box">
        <img
          src={
            message === "Product added to Wishlist!"
              ? require("../shop/liked.png")
              : message === "Product added to Cart!" ? require("../shop/cartFilled.png"):null
          }
          className="image-background"
        />
        <span className="popup-close" onClick={() => setShow(false)}>
          &times;
        </span>

        <p className="popup-text">{message}</p>
      </div>
    </div>
  );
};

export default Popup;
