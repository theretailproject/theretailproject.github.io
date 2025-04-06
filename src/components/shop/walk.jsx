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
import { auth,firestore } from "../../firebase";
export const Walk = () => {
  const { addToCart, doingWork, addToWishlist, delFromWishlist, delFromCart } =
    useUserContext();
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

  return (
    <div className="nproducts">
      {walkProducts.length === 0 ? (
        <div className="noProductDiv">
          <img src={noProduct} className="noProductImg" alt="No Product" />
          {/* No Products Found! */}
        </div>
      ) : (
        <div className="ProductCardRow">
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
                      onClick={()=>{
                          delFromCart(p)
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
                      onClick={()=>{
                          addToCart(p)
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
                        onClick={()=>{
                          delFromWishlist(p)
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
                          addToWishlist(p);
                        }}
                      />
                    </div>
                  )}
                </div>
                <Link to={`/shop/${p.category}/${p.itemId}`}>
                  <img src={p.thumbnail} className="productImg" alt="Product" />
                </Link>
              </div>

              <p className="productName">{p.name}</p>
              <p className="productPrice">₹ {p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

