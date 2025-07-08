import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, firestore, firebase } from "../../firebase";
import logo from "./pawb.png";
import fullLogo from "./full-logo.jpg";
import ccart from "./shopping-bag.png";
import user from "./user.png";
import simg from "./sig.png";
import close from "./close.png";
import "./nav.scss";
import dots from "./dots.png";
import home from "./home.png";
import profile from "./person.png";
import enroll from "./page.png";
import invoices from "./dollar-sign.png";
import support from "./support.png";
import exiti from "./exit.png";
import menuk from "./menuk.png";
import wishlist from "./wishlist.png";
import shopimg from "./shop.png";
import faq from "./faq.png";
import aboutimg from "./about.png";
import pawimg from "./paw.png";
import recimg from "./recycle.png";
import "./cart.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useUserContext } from "../../UserContext";
import { Navigation } from "@coreui/coreui";
import { use } from "react";

function Nav() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(auth.currentUser?.uid || null);
  const {
    checkoutAmt,
    cartData,
    wishData,
    setCheckoutAmt,
    userData,
    doingWork,
    setDoingWork,
  } = useUserContext();
  const navigate = useNavigate();
  // console.log(cartData.length);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [amount, setAmount] = useState(0);

  const overlayRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        closeNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const closeNav = () => {
    document.getElementById("overlayBox").style.width = "0cm";
    document.getElementById("overlayNav").style.display = "none";
  };

  const openNav = () => {
    setTimeout(() => {
      document.getElementById("overlayBox").style.width = "7cm";
    }, 1);
    document.getElementById("overlayNav").style.display = "flex";
  };

  const closeCart = () => {
    document.getElementById("cartNew").style.width = "0cm";
  };

  const openCart = () => {
    const cartElement = document.getElementById("cartNew");
    if (window.innerWidth < 700) {
      cartElement.style.width = "100%";
    } else {
      cartElement.style.width = "12cm";
    }
  };

  const plusQty = async (c) => {
    await setDoingWork(true);
    const newAmt = userData.checkoutAmt + Number(c.price);
    await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("cart")
      .doc(c.docId)
      .update(
        {
          quantity: firebase.firestore.FieldValue.increment(1),
        },
        { merge: true }
      )
      .then(async () => {
        setCheckoutAmt(newAmt);
        await firestore.collection("users").doc(auth.currentUser?.uid).update(
          {
            checkoutAmt: newAmt,
          },
          { merge: true }
        );
        await setDoingWork(false);
      });
  };

  const minusQty = async (c) => {
    if (c.quantity == 1) {
      deleteProd(c);
    } else {
      await setDoingWork(true);
      const newAmt = userData.checkoutAmt - Number(c.price);
      firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("cart")
        .doc(c.docId)
        .update(
          {
            quantity: firebase.firestore.FieldValue.increment(-1),
          },
          { merge: true }
        )
        .then(async () => {
          setCheckoutAmt(newAmt);
          firestore.collection("users").doc(auth.currentUser?.uid).update(
            {
              checkoutAmt: newAmt,
            },
            { merge: true }
          );
          await setDoingWork(false);
        });
    }
  };

  const deleteProd = async (c) => {
    await setDoingWork(true);
    const newAmt = userData.checkoutAmt - Number(c.price) * Number(c.quantity);
    await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("cart")
      .doc(c.docId)
      .delete();
    setCheckoutAmt(newAmt);
    await firestore.collection("users").doc(auth.currentUser?.uid).update(
      {
        checkoutAmt: newAmt,
      },
      { merge: true }
    );
    await setDoingWork(false);
  };

  const openCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const setCheckoutAmount = async (amount) => {
    // try {
    //   setDoingWork(true);

    //   await firestore
    //     .collection("users")
    //     .doc(auth.currentUser?.uid)
    //     .set(
    //       {
    //         checkoutAmt: amount,
    //       },
    //       { merge: true }
    //     );

    //   setDoingWork(false);
    openCheckout();
    // } catch (error) {
    //   console.error("Error setting checkout amount:", error);
    //   setDoingWork(false);
    // }
  };

  const [cart, setCart] = useState([]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const cartRef = firestore
        .collection("users")
        .doc(currentUser)
        .collection("cart");

      const unsubscribe = cartRef.onSnapshot((snapshot) => {
        const cartItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCart(cartItems);
      });

      return () => unsubscribe();
    } else {
      setCart([]); // Reset cart when no user
    }
  }, [currentUser]);

  useEffect(() => {
    if (cart.length == 0) {
      setAmount(0);
    }
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setAmount(total);
  }, [cart]);

  return (
    <>
      <div id="overlayNav" className="overlay-nav">
        <div ref={overlayRef} id="overlayBox" className="overlay-box">
          <div className="close-div">
            {/* <img className="close-img" src={cross} onClick={closeNav} /> */}
          </div>
          <div className="account-dets-menu">
            <Link to="/">
              <div
                onClick={closeNav}
                className={
                  isActive("/")
                    ? "account-dets-menu-item activeM"
                    : "account-dets-menu-item"
                }
              >
                <img className="acc-dets-img" src={home} />
                <p className="acc-dets-text">Home</p>
              </div>
            </Link>

            <Link to="/about-us">
              <div
                onClick={closeNav}
                className={
                  isActive("/about-us")
                    ? "account-dets-menu-item activeM"
                    : "account-dets-menu-item"
                }
              >
                <img className="acc-dets-img" src={aboutimg} />
                <p className="acc-dets-text">About Us</p>
              </div>
            </Link>
            <Link to="/how-to-recycle">
              <div
                onClick={closeNav}
                className={
                  isActive("/how-to-recycle")
                    ? "account-dets-menu-item activeM"
                    : "account-dets-menu-item"
                }
              >
                <img className="acc-dets-img" src={recimg} />
                <p className="acc-dets-text">How to Upcycle</p>
              </div>
            </Link>

            <Link to="/shop">
              <div
                onClick={closeNav}
                className={
                  isActive("/shop")
                    ? "account-dets-menu-item activeM"
                    : "account-dets-menu-item"
                }
              >
                <img className="acc-dets-img" src={shopimg} />
                <p className="acc-dets-text">Shop</p>
              </div>
            </Link>
            {auth.currentUser ? (
              <Link to="/profile">
                <div
                  onClick={closeNav}
                  className={
                    isActive("/profile")
                      ? "account-dets-menu-item activeM hidemi"
                      : "account-dets-menu-item hidemi"
                  }
                >
                  <img className="acc-dets-img" src={profile} />
                  <p className="acc-dets-text">My Profile</p>
                </div>
              </Link>
            ) : null}
            {/* {
                            auth.currentUser
                                ?
                                <Link to="/pet-profile">
                                    <div onClick={closeNav} className={isActive("/pet-profile") ? "account-dets-menu-item activeM " : "account-dets-menu-item "}>
                                        <img className="acc-dets-img" src={pawimg} />
                                        <p className="acc-dets-text">
                                            Pet Profile
                                        </p>
                                    </div>
                                </Link>
                                : null
                        } */}
            {auth.currentUser ? (
              <Link to="/orders">
                <div
                  onClick={closeNav}
                  className={
                    isActive("/orders")
                      ? "account-dets-menu-item activeM "
                      : "account-dets-menu-item "
                  }
                >
                  <img className="acc-dets-img" src={enroll} />
                  <p className="acc-dets-text">My Orders</p>
                </div>
              </Link>
            ) : null}
            {auth.currentUser ? (
              <Link to="/cart">
                <div
                  onClick={closeNav}
                  className={
                    isActive("/cart")
                      ? "account-dets-menu-item activeM hidemi"
                      : "account-dets-menu-item hidemi"
                  }
                >
                  <img className="acc-dets-img" src={ccart} />
                  <p className="acc-dets-text">Cart</p>
                </div>
              </Link>
            ) : null}

            <Link to="/faq">
              <div
                onClick={closeNav}
                className={
                  isActive("/faq")
                    ? "account-dets-menu-item activeM"
                    : "account-dets-menu-item"
                }
              >
                <img className="acc-dets-img" src={faq} />
                <p className="acc-dets-text">FAQs</p>
              </div>
            </Link>
            <Link to="/contact">
              <div
                onClick={closeNav}
                className={
                  isActive("/contact")
                    ? "account-dets-menu-item activeM"
                    : "account-dets-menu-item"
                }
              >
                <img className="acc-dets-img" src={support} />
                <p className="acc-dets-text">Contact Us</p>
              </div>
            </Link>
            {auth.currentUser ? (
              <div
                onClick={() => {
                  auth.signOut();
                  closeNav();
                  navigate("/signin");
                }}
                className="account-dets-menu-item"
              >
                <img className="acc-dets-img" src={exiti} />
                <p className="acc-dets-text">Sign Out</p>
              </div>
            ) : null}

            {auth.currentUser ? null : (
              <div className="login-buttons-overlay">
                {/* <Link to='/signup' >
                                            <p onClick={closeNav} className="menu-item login-button"> Sign Up </p>
                                        </Link> */}
                <Link to="/signin">
                  <p onClick={closeNav} className="menu-item login-button">
                    {" "}
                    Sign In{" "}
                  </p>
                </Link>
              </div>
            )}

            <div
              onClick={() => {
                closeNav();
              }}
              className="account-dets-menu-item"
            >
              {/* <img className="acc-dets-img" src={cross} /> */}
              <p className="acc-dets-text">Close</p>
            </div>
          </div>
        </div>
      </div>

      <div id="cartNew" className="Cart-new">
        <div className="cart-box-new">
          <div className="cart-head-new">
            <div className="cart-head-left-new">
              <p className="cart-total-text">
                Total Item ({cart && cart.length})
              </p>
            </div>
            <div className="cart-head-right">
              <p onClick={closeCart} className="closeCart">
                Close
              </p>
            </div>
          </div>
          <div className="cart-prods-list">
            {!cart || cart.length === 0 ? (
              <p>No product in cart</p>
            ) : (
              cart.map((c) => (
                <Link to={`shop/${c.category}/${c.itemId}`} key={c.docId}>
                  <div className="cart-prod-new">
                    <div className="cart-prod-new-left">
                      <img
                        className="cart-prod-new-img"
                        src={c.thumbnail}
                        alt={c.name}
                      />
                      <p
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigating when clicking delete
                          deleteProd(c);
                        }}
                        className="cart-del-new"
                      >
                        Delete
                      </p>
                    </div>
                    <div className="cart-prod-new-right">
                      <p className="cart-prod-new-name">{c.name}</p>
                      <p className="cart-prod-new-price">₹ {c.price}</p>
                      {c.color && c.color != "default" ? (
                        <p className="cart-prod-new-price">Color: {c.color}</p>
                      ) : null}
                      {c.size && c.size != "default" ? (
                        <p className="cart-prod-new-price">Size: {c.size}</p>
                      ) : null}
                      <div className="cart-new-quantity-box">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            minusQty(c);
                          }}
                          className="cart-minus-new"
                          disabled={doingWork}
                        >
                          -
                        </button>
                        <p className="cart-quantity-new">{c.quantity}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            plusQty(c);
                          }}
                          className="cart-plus-new"
                          disabled={doingWork}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {
            <div className="cart-checkout-new">
              <div
                onClick={(e) => {
                  if (
                    // !doingWork &&
                    // userData.checkoutAmt &&
                    // userData.checkoutAmt > 0
                    amount
                  ) {
                    setCheckoutAmount(amount);
                    openCheckout();
                  }
                }}
                className="checkout-final"
              >
                <p className="checout-text">Proceed to Checkout</p>
                <p>|</p>
                <p className="checout-price">₹ {amount}</p>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="NavNew">
        <div className="new-nav-box">
          <div className="new-nav-upper">
            <div className="new-nav-logo">
              <div className="logo-image">
                <img
                  src={logo}
                  alt="Cart Icon"
                  onMouseOver={(e) => {
                    e.currentTarget.src = menuk;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.src = logo;
                  }}
                  onClick={openNav}
                  className="logo-image-paw"
                  title="Menu on Click"
                />
              </div>

              <Link className="new-nav-logo-box" to="/">
                <p title="Home" className="co-name-text" id="phoneLogo">
                  The <span className="re-text">Re</span>Tail Project
                </p>
              </Link>
            </div>
            <Link className="new-nav-logo-box" to="/">
              <p title="Home" className="co-name-text " id="deskLogo">
                The <span className="re-text">Re</span>Tail Project
              </p>
            </Link>

            <div className="new-nav-icons">
              <div className="menu">
                {auth.currentUser ? (
                  <div className="nav-menu-bar">
                    <Link className="nav-linkk" to="/wishlist">
                      <span className="cartDotDiv">
                        <img
                          title="Your Wishlist"
                          className="menuk hideoii"
                          src={wishlist}
                        />
                        <div className="cartDot">
                          {wishData.length > 0 ? wishData.length : 0}
                        </div>
                      </span>
                    </Link>
                    <span className="cartDotDiv">
                      {" "}
                      <img
                        onClick={openCart}
                        className="menuk hideoii"
                        src={ccart}
                        title="Your Cart"
                      />
                      <div className="cartDot">
                        {cartData.length > 0 ? cartData.length : 0}
                      </div>
                    </span>

                    <Link className="nav-linkk" to="/profile">
                      <img
                        title="Your Profile"
                        className="menuk hideoii"
                        src={profile}
                      />
                    </Link>
                    {/* <Link className='nav-linkk' to="/pet-profile">
                                                <img className="menuk hideoii" src={pawimg} />
                                            </Link> */}
                    {/* <Link className='nav-linkk' to="/orders">
                                                <img className="menuk hideoii" src={enroll} />
                                            </Link> */}
                    {/* <img onClick={openNav} className="menuk" src={logo} /> */}
                  </div>
                ) : (
                  <div className="nav-menu-i">
                    <div className="login-buttons">
                      {/* <Link to='/signup' >
                                                        <p onClick={closeNav} className="menu-item login-button"> Sign Up </p>
                                                    </Link> */}
                      <Link to="/signin">
                        <p
                          onClick={closeNav}
                          className="menu-item login-button"
                        >
                          {" "}
                          Sign In{" "}
                        </p>
                      </Link>
                    </div>
                    {/* <img onClick={openNav} className="menuk" src={menuk} /> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
