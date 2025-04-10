import "./shop.scss";
import products from "./products.json";
import { Link } from "react-router-dom";
import { useUserContext } from "../../UserContext";
import like from "./like.png";
import liked from "./liked.png";
import cartH from "./cartHollow.png";
import cartF from "./cartFilled.png";
import noProduct from "./noProducts.png";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebase";
export const Walk = () => {
  const {
    userData,
    addToCart,
    doingWork,
    addToWishlist,
    delFromWishlist,
    delFromCart,
  } = useUserContext();
  const walkProducts = products.filter((p) => p.category === "walk");

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
    userData && userData.uid
      ? addToWishlist(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function addToCartFunc(p) {
    userData && userData.uid
      ? addToCart(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function deleteFromCartFunc(p) {
    userData && userData.uid
      ? delFromCart(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  function deleteFromWishlistFunc(p) {
    userData && userData.uid
      ? delFromWishlist(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }

  return (
    <div className="nproducts">
      {walkProducts.length === 0 ? (
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
                <button className="overlaySignInChildBtn1">Cancel</button>
              </div>
            </div>
          </div>
          {walkProducts.map((p) => (
            <div className="ProductCard" key={p.itemId}>
              <div className="imgCont">
                <div className="overlayProdCard">
                  {cart &&
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
