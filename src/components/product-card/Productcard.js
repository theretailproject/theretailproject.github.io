import "./Productcard.scss";
import { Link } from "react-router-dom";
import { useUserContext } from "../../UserContext";
import like from "./like.png";
import liked from "./liked.png";
import cartH from "./cartHollow.png";
import cartF from "./cartFilled.png";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebase";
import bestseller from "./bestseller.json";
import { useEffect,useState } from "react";

const Productcard = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser?.uid || null);
  const { addToCart, doingWork, addToWishlist, delFromWishlist, delFromCart } =
    useUserContext();
  // console.log(bestseller);
const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
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
  return (
    <>
      {bestseller &&
        bestseller.map((prod) => (
          <>
            {/* {console.log(prod)} */}
            <div className="ProductCard" key={prod.itemId}>
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
              <div className="imgCont">
                <div className="overlayProdCard">
                  {cart &&
                  cart.some((product) => product.itemId === prod.itemId) ? (
                    <div className="smallImgCartContFilled">
                      <img
                        src={cartF}
                        alt="Cart Icon"
                        onMouseOver={(e) => (e.currentTarget.src = cartH)}
                        onMouseOut={(e) => (e.currentTarget.src = cartF)}
                        className="smallBtn"
                        onClick={() => {
                          deleteFromCartFunc(prod);
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
                          addToCartFunc(prod);
                        }}
                      />
                    </div>
                  )}
                  {wishlist &&
                  wishlist.some((product) => product.itemId === prod.itemId) ? (
                    <div className="smallImgHeartContFilled">
                      <img
                        src={liked}
                        alt="Like Icon"
                        onMouseOver={(e) => (e.currentTarget.src = like)}
                        onMouseOut={(e) => (e.currentTarget.src = liked)}
                        className="smallBtn"
                        onClick={() => {
                          deleteFromWishlistFunc(prod);
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
                          addToWishlistFunc(prod);
                        }}
                      />
                    </div>
                  )}
                </div>

                <Link to={`/shop/${prod.category}/${prod.itemId}`}>
                  <img
                    src={prod.thumbnail}
                    className="productImg"
                    alt="Product"
                  />
                </Link>
              </div>

              <p className="productName">{prod.name}</p>
              <p className="productPrice">₹ {prod.price}</p>
            </div>
          </>
        ))}
    </>
  );
};

export default Productcard;
