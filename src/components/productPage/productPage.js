import { useParams } from "react-router-dom";
import "./productPage.scss";
import products from "../shop/products.json";
import { useState } from "react";
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
function ProductPage() {
  const { addToCart, doingWork, addToWishlist, delFromWishlist, delFromCart } =
    useUserContext();
  // const { pid } = useParams();

  // const prod = useMemo(() => {
  //   return products.find((product) => product.itemId == pid);
  // }, [pid]);
  const [selectedColor, setSelectedColor] = useState(null);
  const handleColorClick = (color) => {
    setSelectedColor(color);
    console.log("Color clicked:", color); // This logs instantly
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
  // const [cart] = useCollectionData(cartRef);
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
          {/* {products.map((p) =>
        p.itemId == pid ? (
          !p.multiple ? (
            <div className="product-page-box">
              <div className="product-left">
                {p.images ? (
                  <div className="prodPageImgDiv">
                    {p.images.map((pi) => (
                      <div
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
                <p className="prodPageName">{p.name}</p>
                <p className="price">₹ {p.price}</p>
                <p className="brand-name fl">by {p["brand-name"]}</p>
                <p className="brand-name weight">{p.weight}</p>
                <p className="brand-name weight">
                  {p.dimensions.map((i, index) => (
                    <span>
                      {" "}
                      {i} {index < p.dimensions.length - 1 ? "X" : ""}
                    </span>
                  ))}
                </p>
                <div className="colorDiv">
                  {p.multiColor === true ? (
                    <>
                      {p.colors &&
                        p.colors.map((color, index) => (
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

                <div className="product-page-buttons">
                  <span className="product-page-buttons-row1">
                    {wishlist &&
                    wishlist.some((product) => product.itemId === p.itemId) ? (
                      <button
                        onClick={() => {
                          deleteFromWishlistFunc(p);
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
                          addToWishlistFunc(p);
                        }}
                        className="pp-button"
                        disabled={doingWork ? true : false}
                      >
                        <img src={like} className="btnSmallImg heart-icon" />
                        Add to Wishlist
                      </button>
                    )}

                    {cart &&
                    cart.some((product) => product.itemId === p.itemId) ? (
                      <button
                        onClick={() => {
                          deleteFromCartFunc(p);
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
                          addToCartFunc(p);
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
                    <button className="pp-button product-page-buttons-row2 blueBG">
                      <img
                        src={bagHollow}
                        alt="Buy Now Icon"
                        className="btnSmallImg bag-icon "
                      />
                      Buy Now
                    </button>
                  </div>
                </div>

                <p
                  className="shareb"
                  onClick={() => {
                    handleShare(p.shareLink);
                  }}
                >
                  Share Product
                </p>
              </div>
            </div>
          ) : null
        ) : null
      )} */}

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
              <p className="brand-name weight">{prod.weight}</p>
              <p className="brand-name weight">
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
                        addToWishlistFunc(prod);
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
                        addToCartFunc(prod);
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
                  <button className="pp-button product-page-buttons-row2 blueBG">
                    <img
                      src={bagHollow}
                      alt="Buy Now Icon"
                      className="btnSmallImg bag-icon "
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
