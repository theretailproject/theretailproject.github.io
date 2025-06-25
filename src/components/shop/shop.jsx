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
import { useState } from "react";
function Shop() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const wearCategories = [
    {
      name: "Bandana",
      subcategories: [
        "Silk Bandana"
      ],
    },
    {
      name: "Shirt",
      subcategories: [
        "Collared Shirt"
      ],
    },
    {
      name: "Collar",
      subcategories: [
        "Bib Collar",
        "Scrunchie Collar",
        "Frill Collar with Net"
      ],
    },
    {
      name: "Frock",
      subcategories: [
        "Festive Frock",
      ],
    },
    {
      name: "Festive",
      subcategories: ["Sherwani", "Lehenga", "Kurta", "Ghagra", "Frock","Jacket/ Coat"],
    },
     {
      name: "Scrunchie",
      subcategories: ["Classic", "Long Tail", "Small Tail"],
    },
     {
      name: "Bow",
      subcategories: ["Stuffed", "Sailor"],
    },
  ];

  const sleepCategories = [
    {
      name: "Beds",
      subcategories: ["Dough Nut Bed", "Patch Work Bed"],
    },
    {
      name: "Pet Tent",
      subcategories: [],
    },
    {
      name: "Snuffle Mat",
      subcategories: ["Soft Mat", "Hard Mat"],
    },
  ];

  const walkCategories = [
    {
      name: "Harness + Leash Combo",
      subcategories: ["Matching Set"],
    },
     {
      name: "Poop Bag",
      subcategories: [],
    },
  ];

  const playCategories = [
    {
      name: "Rope Toys",
      subcategories: [ "Tug Toy"],
    },
    {
      name: "Teether Toys",
      subcategories: ["Fish Teether", "Bone Teether"],
    },
    {
      name: "Snuffle Toys",
      subcategories: ["Ball"],
    },
    {
      name: "Chrochet Toys",
      subcategories: ["Orange", "Bird", "Carrot", "Ball","Banana", "Mango", "Moon", "Heart", "Strawberry", "Ice Cream", "Soft Bone", "Honey Bee"],
    },
  ];

  const [hoveredCategory, setHoveredCategory] = useState(null);
  return (
    <div className="Shop">
      <div className="shop-box">
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
          <div className="dropdown-wrapper">
            <Link to="/shop/wear">
              <p className="shop-cat-name">Wear ▼</p>
            </Link>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {wearCategories.map((category, index) => (
                    <p
                      key={index}
                      className="dropdown-heading"
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      {category.name}
                    </p>
                  ))}
                </div>

                <div className="dropdown-content-col2">
                  {hoveredCategory?.subcategories.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/shop/wear/${hoveredCategory.name.toLowerCase()}/${sub
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown-wrapper">
            <Link to="/shop/sleep">
              <p className="shop-cat-name">Sleep ▼</p>
            </Link>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {sleepCategories.map((category, index) => (
                    <p
                      key={index}
                      className="dropdown-heading"
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      {category.name}
                    </p>
                  ))}
                </div>

                <div className="dropdown-content-col2">
                  {hoveredCategory?.subcategories.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/shop/wear/${hoveredCategory.name.toLowerCase()}/${sub
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown-wrapper">
            <Link to="/shop/walk">
              <p className="shop-cat-name">Walk ▼</p>
            </Link>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {walkCategories.map((category, index) => (
                    <p
                      key={index}
                      className="dropdown-heading"
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      {category.name}
                    </p>
                  ))}
                </div>

                <div className="dropdown-content-col2">
                  {hoveredCategory?.subcategories.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/shop/wear/${hoveredCategory.name.toLowerCase()}/${sub
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown-wrapper">
            <Link to="/shop/play">
              <p className="shop-cat-name">Play ▼</p>
            </Link>

            <div className="dropdown-content">
              <div className="dropdown-content-col">
                <div className="dropdown-content-col1">
                  {playCategories.map((category, index) => (
                    <p
                      key={index}
                      className="dropdown-heading"
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      {category.name}
                    </p>
                  ))}
                </div>

                <div className="dropdown-content-col2">
                  {hoveredCategory?.subcategories.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/shop/wear/${hoveredCategory.name.toLowerCase()}/${sub
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link to="/shop/preserve">
            <p
              className={
                isActive("/shop/preserve")
                  ? "shop-cat-name activeCat"
                  : "shop-cat-name"
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
        </Routes>
      </div>
    </div>
  );
}

export default Shop;
