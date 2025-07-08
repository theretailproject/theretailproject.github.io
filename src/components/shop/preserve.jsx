import PreserveForHuman from "./pHuman";
import PreserveForPet from "./pPet";
import "./preserve.scss";
import { Outlet, Link } from "react-router-dom";
import { Route, Routes, useLocation } from "react-router-dom";

function Preserve() {
  return (
    <div className="Preserve">
      <div className="preserve-box">
        <p className="prehead">
          Preserve the Love, Sustain the Memory – The ReTail Project
        </p>
        <br />
        <div className="preserve-container">
          <div className="preserve-boxes">
            <Link to="/shop/preserve/foryou">
              <div className="preserve-option-box">For You</div>
            </Link>
            <Link to="/shop/preserve/foryourpet">
              <div className="preserve-option-box">For Your Pet</div>
            </Link>
          </div>
        </div>
        <p className="pretext">
          At The ReTail Project, we understand that pets are family. Their love,
          warmth, and presence leave an everlasting imprint on our hearts. To
          honor that bond, we offer a heartfelt way to preserve memories of your
          beloved pets and transform them into timeless, reusable keepsakes.
          <br />
          <br />
          With our sustainable upcycling approach, we take cherished
          items—whether it’s a favorite blanket, a leash, an old toy, or even
          fur clippings—and craft them into personalized mementos that hold deep
          sentimental value.
          <br />
          <br />
          Ways to Keep Their Memory Close -
          <ul>
            <li>
              ✨ <b>Memory Bouquets</b> – Crafted from fabric and materials tied
              to your pet, a beautiful forever bouquet that never fades.
            </li>
            <li>
              ✨ <b>Custom Sleeves & Covers</b> – Turn their favorite bed cover,
              clothing, or accessories into protective and stylish cases for
              books, journals, or gadgets.
            </li>
            <li>
              ✨ <b>Framed Moments</b> – Preserve their paw prints, collars, or
              favorite toy pieces in a handcrafted memory frame to cherish
              forever.
            </li>
            <li>
              ✨ <b>Keepsake Cases</b> – Custom pouches or cases made from their
              belongings, perfect for holding small treasures, notes, or
              jewelry.
            </li>
          </ul>
          <br />
          By choosing The ReTail Project, you’re not only keeping your pet’s
          memory alive but also contributing to a sustainable, eco-friendly
          future—giving new life to old materials with love and purpose.
          <br />
          Because love never fades, and memories deserve to be cherished for a
          lifetime.
          <br />
          Let’s create something meaningful together. ♻❤
          <br />
          <br />
          Drop a "hi" on either WhatsApp or at contact@theretailproject.in and
          let's preserve!!
        </p>
      </div>
    </div>
  );
}

export default Preserve;
