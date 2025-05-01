import { useParams } from "react-router-dom";
import "./productPage.scss";
import products from "../shop/products.json";
import { useState, useMemo, useEffect } from "react";
import { useUserContext } from "../../UserContext";
import like from "./like.png";
import liked from "./liked.png";
import cartH from "./cartHollow.png";
import cartF from "./cartFilled.png";
import bagHollow from "./bagHollow.png";
import bagFilled from "./bagFilled.png";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebase";
import { Link } from "react-router-dom";

function ProductPage() {
  const { addToCart, doingWork, addToWishlist, delFromWishlist, delFromCart } =
    useUserContext();

  const [currentUser, setCurrentUser] = useState(auth.currentUser?.uid);

  const { pid } = useParams();

  const prod = useMemo(() => {
    return products.find((product) => product.itemId == pid);
  }, [products, pid]);

  const [currentImg, setCurrentImg] = useState(null);

  // ✅ Set currentImg ONLY once when prod changes
  useEffect(() => {
    if (prod?.thumbnail) {
      setCurrentImg(prod.thumbnail);
    }
  }, [prod]);

  const [selectedColor, setSelectedColor] = useState(null);
  const handleColorClick = (color) => setSelectedColor(color);
  const [selectedSize, setSelectedSize] = useState(null);
  const handleSizeClick = (color) => setSelectedSize(color);
  // Firestore data

  const [cartList, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      setWishlist([]);
      return;
    }

    const cartRef = firestore
      .collection("users")
      .doc(currentUser)
      .collection("cart");

    const wishlistRef = firestore
      .collection("users")
      .doc(currentUser)
      .collection("wishlist");

    const unsubscribeCart = cartRef.onSnapshot((snapshot) => {
      const cartItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCart(cartItems);
    });

    const unsubscribeWishlist = wishlistRef.onSnapshot((snapshot) => {
      const wishlistItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlist(wishlistItems);
    });

    // Cleanup both listeners on unmount or user change
    return () => {
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, [currentUser]);
  const onMouseOverChange = (x) => setCurrentImg(x);

  const handleShare = async (url) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check this out!",
          text: "I found an amazing project at The ReTail Project",
          url: url,
        });
      } else {
        console.log("Web Share API not supported");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const [error, setError] = useState("");

  const handleProtectedAction = (callback, product) => {
    setError(""); // clear previous error
  
    if (prod.multiColor && !selectedColor) {
      setError("Please select a color to proceed.");
      document.getElementById("overlayErrorId").style.display = "flex";
      return;
    }
  
    if (prod.multiSize && !selectedSize) {
      setError("Please select a size to proceed.");
      document.getElementById("overlayErrorId").style.display = "flex";
      return;
    }
  
    const finalProduct = {
      ...product,
      ...(prod.multiColor && { color: selectedColor }),
      ...(prod.multiSize && { size: selectedSize }),
    };
  
    requireAuth(callback, finalProduct);
  };

  const overlay = document.getElementById("overlaySignInId");

  const requireAuth = (callback, product) => {
    auth?.currentUser
      ? callback(product)
      : overlay && (overlay.style.display = "flex");
  };

  const closeOverlay = () => {
    if (overlay) overlay.style.display = "none";
    document.getElementById("overlayErrorId").style.display = "none";
  };

  if (!prod) {
    return (
      <div className="MainDiv">
        <div className="not-found">Product not found.</div>
      </div>
    );
  }

  // Now rendering logic below (no changes needed here)
  return (
    <div className="MainDiv">
      {/* ... overlay code ... */}
      <div className="overlaySignIn" id="overlaySignInId">
        <div className="overlaySignInChildren">
          <div className="overlaySignInChild">
            <p className="overlaySignInChild1">Sign In to Proceed</p>
            <Link to="/signin">
              <button className="overlaySignInChildBtn2">Move to SignIn</button>
            </Link>
            <button className="overlaySignInChildBtn1" onClick={closeOverlay}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="overlaySignIn" id="overlayErrorId">
        <div className="overlaySignInChildren">
          <div className="overlaySignInChild">
            <p>{error}</p>
            <button className="overlaySignInChildBtn1" onClick={closeOverlay}>
              Okay
            </button>
          </div>
        </div>
      </div>
      <div className="product-page-box">
        <div className="product-left">
          {prod.images && (
            <div className="prodPageImgDiv">
              {prod.images.map((pi, index) => (
                <div
                  key={index}
                  className={
                    pi === currentImg
                      ? "prodPageSmallImgDiv activeImgProdPage"
                      : "prodPageSmallImgDiv"
                  }
                >
                  <img
                    className="prodPageSmallImg"
                    onMouseEnter={() => onMouseOverChange(pi)}
                    onClick={() => setCurrentImg(pi)}
                    src={pi}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
          <img className="prodPageImg" src={currentImg} alt="Main" />
        </div>

        <div className="product-right">
          <p className="prodPageName">{prod.name}</p>
          <p className="price">₹ {prod.price}</p>
          <p className="brand-name fl">by {prod["brand-name"]}</p>
          <p className="brand-name weight">{prod.weight}</p>
          <p className="brand-name weight">
            {prod.dimensions?.map((d, i) => (
              <span key={i}>
                {d} {i < prod.dimensions.length - 1 ? "X" : ""}
              </span>
            ))}
          </p>

          {prod.multiColor && (
            <div className="colorDiv">
              {prod.colors?.map((color, index) => (
                <button
                  key={index}
                  className={
                    selectedColor === color ? "colorName selected" : "colorName"
                  }
                  onClick={() => handleColorClick(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          )}
          {prod.multiSize && (
            <div className="colorDiv">
              {prod.size?.map((size, index) => (
                <button
                  key={index}
                  className={
                    selectedSize === size ? "colorName selected" : "colorName"
                  }
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <div className="product-page-buttons">
            <span className="product-page-buttons-row1">
              {wishlist?.some((p) => p.itemId === prod.itemId) ? (
                <button
                  onClick={() =>  requireAuth(delFromWishlist, prod)}
                  className="pp-button"
                  disabled={doingWork}
                >
                  <img src={liked} className="btnSmallImg heart-icon-filled" />
                  Remove from Wishlist
                </button>
              ) : (
                <button
                  onClick={() => handleProtectedAction(addToWishlist, prod)}
                  className="pp-button"
                  disabled={doingWork}
                >
                  <img src={like} className="btnSmallImg heart-icon" />
                  Add to Wishlist
                </button>
              )}

              {cartList?.some((p) => p.itemId === prod.itemId) ? (
                <button
                  onClick={() =>  requireAuth(delFromCart, prod)}
                  className="pp-button"
                  disabled={doingWork}
                >
                  <img src={cartF} className="btnSmallImg cart-icon-filled" />
                  Remove from Cart
                </button>
              ) : (
                <button
                  onClick={() => handleProtectedAction(addToCart, prod)}
                  className="pp-button"
                  disabled={doingWork}
                >
                  <img src={cartH} className="btnSmallImg cart-icon" />
                  Add to Cart
                </button>
              )}
            </span>
            <div>
              <button className="pp-button product-page-buttons-row2 blueBG">
                <img
                  src={bagHollow}
                  alt="Buy Now Icon"
                  className="btnSmallImg bag-icon"
                />
                Buy Now
              </button>
            </div>
          </div>

          <p className="shareb" onClick={() => handleShare(prod.shareLink)}>
            Share Product
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
