import { useParams } from "react-router-dom";
import "./productPage.scss";
import products from "../shop/products.json";
import { useState, useEffect } from "react";
import { useUserContext } from "../../UserContext";
import like from "./like.png";
import liked from "./liked.png";
import cartH from "./cartHollow.png";
import cartF from "./cartFilled.png";
import bagHollow from "./bagHollow.png";
import bagFilled from "./bagFilled.png";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore, firebase } from "../../firebase";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import Popup from "../popup/popup";

function ProductPage() {
  const {
    addToCart,
    doingWork,
    addToWishlist,
    delFromWishlist,
    delFromCart,
    updateBuyList,
    delFromBuyList,  productAdded,
    setProductAdded,
    wishAdded,
    setWishAdded,
  } = useUserContext();
  // const { pid } = useParams();

  // const prod = useMemo(() => {
  //   return products.find((product) => product.itemId == pid);
  // }, [pid]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const handleColorClick = (color) => {
    setSelectedColor(color);
    console.log("Color clicked:", color); // This logs instantly
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    console.log("Size clicked:", size); // This logs instantly
  };
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

  // const [currentImg, setCurrentImg] = useState(() => {
  //   const product = products.find((product) => product.itemId == pid);
  //   return product ? product.thumbnail : null;
  // });

  // const [currentImg, setCurrentImg] = useState(() => prod?.thumbnail || null);

  // console.log(products);
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
  // console.log(cart);
  const onMouseOverChange = (x) => {
    setCurrentImg(x);
  };

  const handleShare = async (url) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check this out!",
          text: "I found an amazing project at The ReTail Project",
          url: url,
        });
        console.log("Content shared successfully");
      } else {
        console.log("Web Share API is not supported in your browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const addToWishlistFunc = async (p, qty, color, size) => {
    console.log(p.itemId);

    const { multiSize, multiColor } = p;

    if (multiSize && !size) {
      alert("Select Size to Add to Wishlist!");
      return;
    }

    if (!multiSize) size = "default";
    if (multiColor && !color) {
      alert("Select Color to Add to Wishlist!");
      return;
    }

    if (!multiColor) color = "default";

    const prod = {
      itemId: p.itemId,
      name: p.name || "Unnamed Product",
      thumbnail: p.thumbnail || "", // fallback to empty string if missing
      link: `/shop/${p.category || "general"}/${p.itemId || "unknown"}`,
      price: p.price || 0,
      quantity: qty || 1,
      size: size || "default",
      color: color || "default",
dimensions:p.dimensions,

      category: p.category || "uncategorized",
    };

    console.log(prod);

    if (auth?.currentUser) {
      try {
        await addToWishlist(prod);
        // alert("Added to wishlist!");
      } catch (error) {
        console.error("Wishlist error:", error);
        alert("Failed to add to wishlist.");
      }
    } else {
      document.getElementById("overlaySignInId").style.display = "flex";
    }
  };

  function openBuyNowDiv(p) {
    auth?.currentUser
      ? openBuyNow(p)
      : (document.getElementById("overlaySignInId").style.display = "flex");
  }
  const addToCartFunc = async (p, qty, color, size) => {
    console.log(p.itemId);

    const { multiSize, multiColor } = p;

    if (multiSize && !size) {
      alert("Select Size to Add to Wishlist!");
      return;
    }

    if (!multiSize) size = "default";
    if (multiColor && !color) {
      alert("Select Color to Add to Wishlist!");
      return;
    }

    if (!multiColor) color = "default";

    const prod = {
      itemId: p.itemId,
      name: p.name || "Unnamed Product",
      thumbnail: p.thumbnail || "", // fallback to empty string if missing
      link: `/shop/${p.category || "general"}/${p.itemId || "unknown"}`,
      price: p.price || 0,
      quantity: qty || 1,
      size: size || "default",
      color: color || "default",
dimensions:p.dimensions,

      category: p.category || "uncategorized",
    };

    console.log(prod);

    if (auth?.currentUser) {
      try {
        await addToCart(prod);
        // alert("Added to cart!");
      } catch (error) {
        console.error("Cart error:", error);
        alert("Failed to add to cart.");
      }
    } else {
      document.getElementById("overlaySignInId").style.display = "flex";
    }
  };

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
  }

  //   function sendToBuyNowList(p) {
  //     const prod = {
  //       p,
  //       selectedColor,
  //       selectedSize,
  //       selectedQty,
  //     };
  // console.log(prod);
  //     updateBuyList(prod);
  //   }
  function openBuyNow() {
    document.getElementById("overlayBuyNow").style.display = "flex";
  }
  function closeBuyNow() {
    document.getElementById("overlayBuyNow").style.display = "none";
  }
  // console.log(p);
  return (
    <div className="MainDiv">
      {!prod ? (
        <div className="not-found">Product not found.</div>
      ) : (
        <>
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
          <div className="overlaySignIn" id="overlayBuyNow">
            <div className="overlaySignInChildren">
              <div className="overlayBuyNowChild">
                <div className="row-justify-space-between">
                  <p className="overlaySignInChild1">Buy Now</p>
                  <button
                    className="overlaySignInChildBtn1"
                    onClick={closeBuyNow}
                  >
                    Close
                  </button>
                </div>
                <div className="productInfo">
                  <img src={prod.thumbnail} className="productInfoImg" />
                  <div className="productInfoText">
                    <p>{prod.name}</p>
                    <p>Quantity: </p>
                    <select
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                    {prod.multiColor ? (
                      <>
                        <p>Colors:</p>
                        <select
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                        >
                          {prod.colors.map((color, idx) => (
                            <option key={idx} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : null}

                    {prod.multiSize ? (
                      <>
                        <p>Sizes:</p>
                        <select
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          {prod.size.map((size, idx) => (
                            <option key={idx} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : null}
                  </div>
                </div>
                <Link to="/checkoutbuynow">
                  <button
                    className="overlaySignInChildBtn2"
                    onClick={() =>
                      updateBuyList({
                        ...prod,
                        selectedColor,
                        selectedQty,
                        selectedSize,
                      })
                    }
                  >
                    Proceed to Buy
                  </button>
                </Link>
              </div>
            </div>
          </div>
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
          <div className="product-page-box">
            <div className="product-left">
              {prod.images ? (
                <div className="prodPageImgDiv">
                  {prod.images.map((pi, index) => (
                    <div
                      key={index}
                      className={
                        pi == currentImg
                          ? "prodPageSmallImgDiv activeImgProdPage"
                          : "prodPageSmallImgDiv"
                      }
                    >
                      <img
                        className="prodPageSmallImg"
                        onMouseEnter={() => {
                          onMouseOverChange(pi);
                        }}
                        onClick={() => {
                          setCurrentImg(pi);
                        }}
                        src={pi}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <img className="prodPageImg" src={currentImg} />
            </div>
            <div className="product-right">
              <p className="prodPageName">{prod.name}</p>
              <p className="price">₹ {prod.price}</p>
              <p className="brand-name fl">by {prod["brand-name"]}</p>
              <p className="brand-name weight">Weight: {prod.weight} grams</p>
              <p className="brand-name weight"> Dimensions: 
                {prod.dimensions.map((i, index) => (
                  <span>
                    {" "}
                    {i} {index < prod.dimensions.length - 1 ? "X" : ""}
                  </span>
                ))}
              </p>
              <div className="colorDiv">
                {prod.multiColor === true ? (
                  <>
                    {prod.colors &&
                      prod.colors.map((color, index) => (
                        <button
                          key={index}
                          className={
                            selectedColor == color
                              ? "colorName selected"
                              : "colorName"
                          }
                          onClick={() => handleColorClick(color)}
                        >
                          {color}
                        </button>
                      ))}
                  </>
                ) : null}
              </div>
              <div className="colorDiv">
                <p>Quantity: </p>
                <select
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
              <div className="colorDiv">
                {prod.multiColor === true ? (
                  <>
                    {prod.size &&
                      prod.size.map((size, index) => (
                        <button
                          key={index}
                          className={
                            selectedSize == size
                              ? "colorName selected"
                              : "colorName"
                          }
                          onClick={() => handleSizeClick(size)}
                        >
                          {size}
                        </button>
                      ))}
                  </>
                ) : null}
              </div>

              <div className="product-page-buttons">
                <span className="product-page-buttons-row1">
                  {wishlist &&
                  wishlist.some((product) => product.itemId === prod.itemId) ? (
                    <button
                      onClick={() => {
                        deleteFromWishlistFunc(prod);
                      }}
                      className="pp-button"
                      disabled={doingWork ? true : false}
                    >
                      <img
                        src={liked}
                        className="btnSmallImg heart-icon-filled"
                      />
                      Remove from Wishlist
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToWishlistFunc(
                          prod,
                          selectedQty,
                          selectedColor,

                          selectedSize
                        );
                      }}
                      className="pp-button"
                      disabled={doingWork ? true : false}
                    >
                      <img src={like} className="btnSmallImg heart-icon" />
                      Add to Wishlist
                    </button>
                  )}

                  {cart &&
                  cart.some((product) => product.itemId === prod.itemId) ? (
                    <button
                      onClick={() => {
                        deleteFromCartFunc(prod);
                      }}
                      className="pp-button"
                      disabled={doingWork ? true : false}
                    >
                      <img
                        src={cartF}
                        className="btnSmallImg cart-icon-filled"
                      />
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToCartFunc(
                          prod,
                          selectedQty,
                          selectedColor,
                          selectedSize
                        );
                      }}
                      className="pp-button"
                      disabled={doingWork ? true : false}
                    >
                      <img src={cartH} className="btnSmallImg cart-icon" />
                      Add to Cart
                    </button>
                  )}
                </span>
                <div className="">
                  <button
                    className="pp-button product-page-buttons-row2 blueBG"
                    onClick={openBuyNowDiv}
                  >
                    <img
                      src={bagHollow}
                      alt="Buy Now Icon"
                      className="btnSmallImg bag-icon"
                    />
                    Buy Now
                  </button>
                </div>
              </div>

              <p
                className="shareb"
                onClick={() => {
                  handleShare(prod.shareLink);
                }}
              >
                Share Product
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductPage;

// import { useParams } from "react-router-dom";
// import "./productPage.scss";
// import products from "../shop/products.json";
// import { useState, useEffect } from "react";
// import { useUserContext } from "../../UserContext";
// import like from "./like.png";
// import liked from "./liked.png";
// import cartH from "./cartHollow.png";
// import cartF from "./cartFilled.png";
// import bagHollow from "./bagHollow.png";
// import bagFilled from "./bagFilled.png";
// import { useCollectionData } from "react-firebase-hooks/firestore";
// import { auth, firestore, firebase } from "../../firebase";
// import { Link } from "react-router-dom";
// import { useMemo } from "react";
// function ProductPage() {
//   const {
//     addToCart,
//     doingWork,
//     addToWishlist,
//     delFromWishlist,
//     delFromCart,
//     updateBuyList,
//     delFromBuyList,
//   } = useUserContext();
//   // const { pid } = useParams();

//   // const prod = useMemo(() => {
//   //   return products.find((product) => product.itemId == pid);
//   // }, [pid]);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedQty, setSelectedQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const handleColorClick = (color) => {
//     setSelectedColor(color);
//     console.log("Color clicked:", color); // This logs instantly
//   };

//   const handleSizeClick = (size) => {
//     setSelectedSize(size);
//     console.log("Size clicked:", size); // This logs instantly
//   };
//   const { pid } = useParams();

//   const prod = useMemo(() => {
//     return products.find((product) => product.itemId == pid);
//   }, [products, pid]);

//   const [currentImg, setCurrentImg] = useState(null);

//   // ✅ Set currentImg ONLY once when prod changes
//   useEffect(() => {
//     if (prod?.thumbnail) {
//       setCurrentImg(prod.thumbnail);
//     }
//   }, [prod]);

//   // const [currentImg, setCurrentImg] = useState(() => {
//   //   const product = products.find((product) => product.itemId == pid);
//   //   return product ? product.thumbnail : null;
//   // });

//   // const [currentImg, setCurrentImg] = useState(() => prod?.thumbnail || null);

//   // console.log(products);
//   const wishlistRef = firestore
//     .collection("users")
//     .doc(auth.currentUser?.uid)
//     .collection("wishlist");
//   const [wishlist] = useCollectionData(wishlistRef);

//   const cartRef = firestore
//     .collection("users")
//     .doc(auth.currentUser?.uid)
//     .collection("cart");
//   const [cart] = useCollectionData(cartRef);
//   // console.log(cart);
//   const onMouseOverChange = (x) => {
//     setCurrentImg(x);
//   };

//   const handleShare = async (url) => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: "Check this out!",
//           text: "I found an amazing project at The ReTail Project",
//           url: url,
//         });
//         console.log("Content shared successfully");
//       } else {
//         console.log("Web Share API is not supported in your browser.");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };
//   function addToWishlistFunc(p) {
//     auth?.currentUser
//       ? addToWishlist(p)
//       : (document.getElementById("overlaySignInId").style.display = "flex");
//   }

//     function openBuyNowDiv(p) {
//     auth?.currentUser
//       ? openBuyNow(p)
//       : (document.getElementById("overlaySignInId").style.display = "flex");
//   }
//   function addToCartFunc(p) {
//     auth?.currentUser
//       ? addToCart(p)
//       : (document.getElementById("overlaySignInId").style.display = "flex");
//   }

//   function deleteFromCartFunc(p) {
//     auth?.currentUser
//       ? delFromCart(p)
//       : (document.getElementById("overlaySignInId").style.display = "flex");
//   }

//   function deleteFromWishlistFunc(p) {
//     auth?.currentUser
//       ? delFromWishlist(p)
//       : (document.getElementById("overlaySignInId").style.display = "flex");
//   }

//   function closeOverlay() {
//     document.getElementById("overlaySignInId").style.display = "none";
//   }

//   //   function sendToBuyNowList(p) {
//   //     const prod = {
//   //       p,
//   //       selectedColor,
//   //       selectedSize,
//   //       selectedQty,
//   //     };
//   // console.log(prod);
//   //     updateBuyList(prod);
//   //   }
//   function openBuyNow() {
//     document.getElementById("overlayBuyNow").style.display = "flex";
//   }
//   function closeBuyNow() {
//     document.getElementById("overlayBuyNow").style.display = "none";
//   }
//   // console.log(p);
//   return (
//     <div className="MainDiv">
//       {!prod ? (
//         <div className="not-found">Product not found.</div>
//       ) : (
//         <>
//           <div className="overlaySignIn" id="overlaySignInId">
//             <div className="overlaySignInChildren">
//               <div className="overlaySignInChild">
//                 <p className="overlaySignInChild1">Sign In to Proceed</p>
//                 <Link to="/signin">
//                   <button className="overlaySignInChildBtn2">
//                     Move to SignIn
//                   </button>
//                 </Link>
//                 <button
//                   className="overlaySignInChildBtn1"
//                   onClick={closeOverlay}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="overlaySignIn" id="overlayBuyNow">
//             <div className="overlaySignInChildren">
//               <div className="overlayBuyNowChild">
//                 <div className="row-justify-space-between">
//                   <p className="overlaySignInChild1">Buy Now</p>
//                   <button
//                     className="overlaySignInChildBtn1"
//                     onClick={closeBuyNow}
//                   >
//                     Close
//                   </button>
//                 </div>
//                 <div className="productInfo">
//                   <img src={prod.thumbnail} className="productInfoImg" />
//                   <div className="productInfoText">
//                     <p>{prod.name}</p>
//                     <p>Quantity: </p>
//                     <select
//                       value={selectedQty}
//                       onChange={(e) => setSelectedQty(e.target.value)}
//                     >
//                       {[1, 2, 3, 4, 5].map((q) => (
//                         <option key={q} value={q}>
//                           {q}
//                         </option>
//                       ))}
//                     </select>
//                     {prod.multiColor ? (
//                       <>
//                         <p>Colors:</p>
//                         <select
//                           value={selectedColor}
//                           onChange={(e) => setSelectedColor(e.target.value)}
//                         >
//                           {prod.colors.map((color, idx) => (
//                             <option key={idx} value={color}>
//                               {color}
//                             </option>
//                           ))}
//                         </select>
//                       </>
//                     ) : null}

//                     {prod.multiSize ? (
//                       <>
//                         <p>Sizes:</p>
//                         <select
//                           value={selectedSize}
//                           onChange={(e) => setSelectedSize(e.target.value)}
//                         >
//                           {prod.size.map((size, idx) => (
//                             <option key={idx} value={size}>
//                               {size}
//                             </option>
//                           ))}
//                         </select>
//                       </>
//                     ) : null}
//                   </div>
//                 </div>
//                 <Link to="/checkoutbuynow">
//                   <button
//                     className="overlaySignInChildBtn2"
//                     onClick={() =>
//                       updateBuyList({
//                         ...prod,
//                         selectedColor,
//                         selectedQty,
//                         selectedSize,
//                       })
//                     }
//                   >
//                     Proceed to Buy
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="product-page-box">
//             <div className="product-left">
//               {prod.images ? (
//                 <div className="prodPageImgDiv">
//                   {prod.images.map((pi, index) => (
//                     <div
//                       key={index}
//                       className={
//                         pi == currentImg
//                           ? "prodPageSmallImgDiv activeImgProdPage"
//                           : "prodPageSmallImgDiv"
//                       }
//                     >
//                       <img
//                         className="prodPageSmallImg"
//                         onMouseEnter={() => {
//                           onMouseOverChange(pi);
//                         }}
//                         onClick={() => {
//                           setCurrentImg(pi);
//                         }}
//                         src={pi}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               ) : null}
//               <img className="prodPageImg" src={currentImg} />
//             </div>
//             <div className="product-right">
//               <p className="prodPageName">{prod.name}</p>
//               <p className="price">₹ {prod.price}</p>
//               <p className="brand-name fl">by {prod["brand-name"]}</p>
//               <p className="brand-name weight">{prod.weight}</p>
//               <p className="brand-name weight">
//                 {prod.dimensions.map((i, index) => (
//                   <span>
//                     {" "}
//                     {i} {index < prod.dimensions.length - 1 ? "X" : ""}
//                   </span>
//                 ))}
//               </p>
//               <div className="colorDiv">
//                 {prod.multiColor === true ? (
//                   <>
//                     {prod.colors &&
//                       prod.colors.map((color, index) => (
//                         <button
//                           key={index}
//                           className={
//                             selectedColor == color
//                               ? "colorName selected"
//                               : "colorName"
//                           }
//                           onClick={() => handleColorClick(color)}
//                         >
//                           {color}
//                         </button>
//                       ))}
//                   </>
//                 ) : null}
//               </div>
//               <div className="colorDiv">
//                 <p>Quantity: </p>
//                 <select
//                   value={selectedQty}
//                   onChange={(e) => setSelectedQty(e.target.value)}
//                 >
//                   {[1, 2, 3, 4, 5].map((q) => (
//                     <option key={q} value={q}>
//                       {q}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="colorDiv">
//                 {prod.multiColor === true ? (
//                   <>
//                     {prod.size &&
//                       prod.size.map((size, index) => (
//                         <button
//                           key={index}
//                           className={
//                             selectedSize == size
//                               ? "colorName selected"
//                               : "colorName"
//                           }
//                           onClick={() => handleSizeClick(size)}
//                         >
//                           {size}
//                         </button>
//                       ))}
//                   </>
//                 ) : null}
//               </div>

//               <div className="product-page-buttons">
//                 <span className="product-page-buttons-row1">
//                   {wishlist &&
//                   wishlist.some((product) => product.itemId === prod.itemId) ? (
//                     <button
//                       onClick={() => {
//                         deleteFromWishlistFunc(prod);
//                       }}
//                       className="pp-button"
//                       disabled={doingWork ? true : false}
//                     >
//                       <img
//                         src={liked}
//                         className="btnSmallImg heart-icon-filled"
//                       />
//                       Remove from Wishlist
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         addToWishlistFunc(prod);
//                       }}
//                       className="pp-button"
//                       disabled={doingWork ? true : false}
//                     >
//                       <img src={like} className="btnSmallImg heart-icon" />
//                       Add to Wishlist
//                     </button>
//                   )}

//                   {cart &&
//                   cart.some((product) => product.itemId === prod.itemId) ? (
//                     <button
//                       onClick={() => {
//                         deleteFromCartFunc(prod);
//                       }}
//                       className="pp-button"
//                       disabled={doingWork ? true : false}
//                     >
//                       <img
//                         src={cartF}
//                         className="btnSmallImg cart-icon-filled"
//                       />
//                       Remove from Cart
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         addToCartFunc(prod);
//                       }}
//                       className="pp-button"
//                       disabled={doingWork ? true : false}
//                     >
//                       <img src={cartH} className="btnSmallImg cart-icon" />
//                       Add to Cart
//                     </button>
//                   )}
//                 </span>
//                 <div className="">
//                   <button
//                     className="pp-button product-page-buttons-row2 blueBG"
//                     onClick={openBuyNowDiv}
//                   >
//                     <img
//                       src={bagHollow}
//                       alt="Buy Now Icon"
//                       className="btnSmallImg bag-icon"
//                     />
//                     Buy Now
//                   </button>
//                 </div>
//               </div>

//               <p
//                 className="shareb"
//                 onClick={() => {
//                   handleShare(prod.shareLink);
//                 }}
//               >
//                 Share Product
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default ProductPage;
