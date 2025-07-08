import "./shop.scss";
import gwalk from "./gwalknp.png";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { Wear } from "./wear";
import { Walk } from "./walk";
import { Sleep } from "./sleep";
import { Play } from "./play";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Preserve from "./preserve";
import { AllProducts } from "./allproducts";
import { useState, useEffect } from "react";
import PreserveForHuman from "./pHuman";
import PreserveForPet from "./pPet";
import PreserveForm from "./preserveform";
import products from "./products.json";
function Shop() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isShopActive = location.pathname.match("shop");
  const isWearActive = location.pathname.includes("shop/wear");
  const isWalkActive = location.pathname.includes("shop/walk");
  const isPlayActive = location.pathname.includes("shop/play");
  const isSleepActive = location.pathname.includes("shop/sleep");
  const isPreserveActive = location.pathname.includes("shop/preserve");
  const [Products, setProducts] = useState(products);
  const [wearCategories, setWearCat] = useState([]);
  const [sleepCategories, setSleepCat] = useState([]);
  const [walkCategories, setWalkCat] = useState([]);
  const [playCategories, setPlayCat] = useState([]);

 useEffect(() => {
  if (!Array.isArray(Products)) return;

  const wearMap = new Map();
  const sleepMap = new Map();
  const walkMap = new Map();
  const playMap = new Map();

  try {
    Products.forEach(({ category, name, itemId }) => {
      switch (category) {
        case "wear":
          if (!wearMap.has(name)) wearMap.set(name, itemId);
          break;
        case "sleep":
          if (!sleepMap.has(name)) sleepMap.set(name, itemId);
          break;
        case "walk":
          if (!walkMap.has(name)) walkMap.set(name, itemId);
          break;
        case "play":
          if (!playMap.has(name)) playMap.set(name, itemId);
          break;
        default:
          break;
      }
    });
  } catch (err) {
    console.error("Error in categorizing products:", err);
    alert("Please Reload");
  }

  const toArray = (map) =>
    Array.from(map.entries()).map(([name, itemId]) => ({ name, itemId }));

  setWearCat(toArray(wearMap));
  setSleepCat(toArray(sleepMap));
  setWalkCat(toArray(walkMap));
  setPlayCat(toArray(playMap));
}, [Products]);



  const [hoveredCategory, setHoveredCategory] = useState(null);
  return (
    <div className="Shop">
      <div className="shop-box">
        <div className="shopHead">
          <p className="shopHeadText">SHOP</p>
        </div>

        <div className="shop-cats-box">
          <Link to="/shop">
            <p
              className={
                isActive("/shop") || isActive("/shop")
                  ? "shop-cat-name activeCat"
                  : "shop-cat-name"
              }
            >
              All Products
            </p>
          </Link>
          <div className="wearDrop dropdown-wrapper">
            <p
              className={
                isWearActive ? "shop-cat-name activeCat" : "shop-cat-name"
              }
            >
              Wear ▼
            </p>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {wearCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/shop/wear/${category.itemId}`}
                    >
                      <p
                        key={index}
                        className="dropdown-heading"
                        onMouseEnter={() => setHoveredCategory(category)}
                      >
                        {category.name}
                      </p>
                    </Link>
                  ))}
                  <Link to="/shop/wear">
                    <p className="dropdown-heading">View All..</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="sleepDrop dropdown-wrapper">
            <p
              className={
                isSleepActive ? "shop-cat-name activeCat" : "shop-cat-name"
              }
            >
              Sleep ▼
            </p>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {sleepCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/shop/sleep/${category.itemId}`}
                    >
                      <p
                        key={index}
                        className="dropdown-heading"
                        onMouseEnter={() => setHoveredCategory(category)}
                      >
                        {category.name}
                      </p>
                    </Link>
                  ))}
                  <Link to="/shop/sleep">
                    <p className="dropdown-heading">View All..</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className=" walkDrop dropdown-wrapper">
            <p
              className={
                isWalkActive ? "shop-cat-name activeCat" : "shop-cat-name"
              }
            >
              Walk ▼
            </p>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {walkCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/shop/walk/${category.itemId}`}
                    >
                      <p
                        key={index}
                        className="dropdown-heading"
                        onMouseEnter={() => setHoveredCategory(category)}
                      >
                        {category.name}
                      </p>
                    </Link>
                  ))}
                  <Link to="/shop/walk">
                    <p className="dropdown-heading">View All..</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="playDrop dropdown-wrapper">
            <p
              className={
                isPlayActive ? "shop-cat-name activeCat" : "shop-cat-name"
              }
            >
              Play ▼
            </p>

            <div className="  dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {playCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/shop/play/${category.itemId}`}
                    >
                      <p
                        key={index}
                        className="dropdown-heading"
                        onMouseEnter={() => setHoveredCategory(category)}
                      >
                        {category.name}
                      </p>
                    </Link>
                  ))}
                  <Link to="/shop/play">
                    <p className="dropdown-heading">View All..</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/shop/preserve">
            <p
              className={
                isPreserveActive ? "shop-cat-name activeCat" : "shop-cat-name"
              }
            >
              Preserve
            </p>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<AllProducts />} />
          <Route path="/wear" element={<Wear />} />
          <Route path="/walk" element={<Walk />} />
          <Route path="/play" element={<Play />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/preserve" element={<Preserve />} />
          <Route path="/preserve/foryou" element={<PreserveForHuman />} />
          <Route path="/preserve/foryourpet" element={<PreserveForPet />} />
          <Route path="/preserve/form/:pid" element={<PreserveForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default Shop;
