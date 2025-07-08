import "./shop.scss";
import products from "./products.json";
import { Link } from "react-router-dom";
import { useUserContext } from "../../UserContext";
import like from "./like.png";
import liked from "./liked.png";
import cartH from "./cartHollow.png";
import cartF from "./cartFilled.png";
import noProduct from "./noProducts.png";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebase";
import Popup from "../popup/popup";

export const Wear = () => {
  const { addToCart, doingWork, addToWishlist, delFromWishlist,  productAdded,
    setProductAdded,
    wishAdded,
    setWishAdded, delFromCart } =
    useUserContext();
  const wearProducts = products.filter((p) => p.category === "wear");

  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const wishlistRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("wishlist");
  const [wishlist] = useCollectionData(wishlistRef);

  const cartRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("cart");
  const [cart] = useCollectionData(cartRef);

  function addToWishlistFunc(p) {
    auth?.currentUser
      ? addToWishlist(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function addToCartFunc(p) {
    auth?.currentUser
      ? addToCart(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function deleteFromCartFunc(p) {
    auth?.currentUser
      ? delFromCart(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function deleteFromWishlistFunc(p) {
    auth?.currentUser
      ? delFromWishlist(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function closeOverlay() {
    document.getElementById("overlaySignInId").style.display = "none";
    document.getElementById("overlayErrorId").style.display = "none";
  }

  const updateSelectedOption = (itemId, key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [key]: value,
      },
    }));
  };

  const handleAction = (product, callback) => {
    const options = selectedOptions[product.itemId] || {};
    const { color, size } = options;

    if (product.multiColor && !color) {
      setError("Please select a color to proceed.");
      document.getElementById("overlayErrorId").style.display = "flex";
      return;
    }

    if (product.multiSize && !size) {
      setError("Please select a size to proceed.");
      document.getElementById("overlayErrorId").style.display = "flex";
      return;
    }

    const finalProduct = {
      ...product,
      ...(product.multiColor && { color }),
      ...(product.multiSize && { size }),
    };

    if (auth.currentUser) {
      callback(finalProduct);
    } else {
      document.getElementById("overlaySignInId").style.display = "flex";
    }
  };

  return (
    <div className="nproducts">
      {wearProducts.length === 0 ? (
        <div className="noProductDiv">
          <img src={noProduct} className="noProductImg" alt="No Product" />
          {/* No Products Found! */}
        </div>
      ) : (
        <div className="ProductCardRow">
          <div className="overlaySignIn" id="overlaySignInId">
            <div className="overlaySignInChildren">
              <div className="overlaySignInChild">
                <p className="overlaySignInChild1">Sign In to Proceed</p>
                <Link to="/signin">
                  <button className="overlaySignInChildBtn2">
                    Move to SignIn
                  </button>
                </Link>
                <button
                  className="overlaySignInChildBtn1"
                  onClick={closeOverlay}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div className="overlaySignIn" id="overlayErrorId">
            <div className="overlaySignInChildren">
              <div className="overlaySignInChild">
                <p>{error}</p>
                <button
                  className="overlaySignInChildBtn1"
                  onClick={closeOverlay}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>{" "}
          {productAdded && (
            <Popup
              message={`Product added to Cart!`}
              onClose={() => setProductAdded(false)}
            />
          )}
          {wishAdded && (
            <Popup
              message={`Product added to Wishlist!`}
              onClose={() => setWishAdded(false)}
            />
          )}
          {wearProducts.map((p) => (
            <div className="ProductCard" key={p.itemId}>
              <div className="imgCont">
                <div className="overlayProdCard">
                  {/* {cart &&
                  cart.some((product) => product.itemId === p.itemId) ? (
                    <div className="smallImgCartContFilled">
                      <img
                        src={cartF}
                        alt="Cart Icon"
                        onMouseOver={(e) => (e.currentTarget.src = cartH)}
                        onMouseOut={(e) => (e.currentTarget.src = cartF)}
                        className="smallBtn"
                        onClick={() => {
                          deleteFromCartFunc(p);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="smallImgCartContHollow">
                      <img
                        src={cartH}
                        alt="Cart Icon"
                        onMouseOver={(e) => (e.currentTarget.src = cartF)}
                        onMouseOut={(e) => (e.currentTarget.src = cartH)}
                        className="smallBtn"
                        onClick={() => {
                          addToCartFunc(p);
                        }}
                      />
                    </div>
                  )}
                  {wishlist &&
                  wishlist.some((product) => product.itemId === p.itemId) ? (
                    <div className="smallImgHeartContFilled">
                      <img
                        src={liked}
                        alt="Like Icon"
                        onMouseOver={(e) => (e.currentTarget.src = like)}
                        onMouseOut={(e) => (e.currentTarget.src = liked)}
                        className="smallBtn"
                        onClick={() => {
                          deleteFromWishlistFunc(p);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="smallImgHeartContHollow">
                      <img
                        src={like}
                        alt="Like Icon"
                        onMouseOver={(e) => (e.currentTarget.src = liked)}
                        onMouseOut={(e) => (e.currentTarget.src = like)}
                        className="smallBtn"
                        onClick={() => {
                          addToWishlistFunc(p);
                        }}
                      />
                    </div>
                  )} */}

                  {/* Cart Button */}
                  {cart && cart.some((prod) => prod.itemId === p.itemId) ? (
                    <div className="smallImgCartContFilled">
                      <img
                        src={cartF}
                        alt="Cart Icon"
                        onMouseOver={(e) => (e.currentTarget.src = cartH)}
                        onMouseOut={(e) => (e.currentTarget.src = cartF)}
                        className="smallBtn"
                        onClick={() => deleteFromCartFunc(p)}
                      />
                    </div>
                  ) : (
                    <div className="smallImgCartContHollow">
                      <img
                        src={cartH}
                        alt="Cart Icon"
                        onMouseOver={(e) => (e.currentTarget.src = cartF)}
                        onMouseOut={(e) => (e.currentTarget.src = cartH)}
                        className="smallBtn"
                        onClick={() => handleAction(p, addToCart)}
                      />
                    </div>
                  )}

                  {/* Wishlist Button */}
                  {wishlist &&
                  wishlist.some((prod) => prod.itemId === p.itemId) ? (
                    <div className="smallImgHeartContFilled">
                      <img
                        src={liked}
                        alt="Like Icon"
                        onMouseOver={(e) => (e.currentTarget.src = like)}
                        onMouseOut={(e) => (e.currentTarget.src = liked)}
                        className="smallBtn"
                        onClick={() => deleteFromWishlistFunc(p)}
                      />
                    </div>
                  ) : (
                    <div className="smallImgHeartContHollow">
                      <img
                        src={like}
                        alt="Like Icon"
                        onMouseOver={(e) => (e.currentTarget.src = liked)}
                        onMouseOut={(e) => (e.currentTarget.src = like)}
                        className="smallBtn"
                        onClick={() => handleAction(p, addToWishlist)}
                      />
                    </div>
                  )}
                </div>
                <Link to={`/shop/${p.category}/${p.itemId}`}>
                  <img src={p.thumbnail} className="productImg" alt="Product" />
                </Link>
              </div>
              <Link to={`/shop/${p.category}/${p.itemId}`}>
                <p className="productName">{p.name}</p>
                <p className="productPrice">₹ {p.price}</p>{" "}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
