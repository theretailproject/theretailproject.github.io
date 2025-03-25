// import "./shop.scss"
// import products from "./products.json"
// import { Link } from "react-router-dom"
// import { useUserContext } from "../../UserContext";

// export const Play = () => {

//     const { addToCart, doingWork } = useUserContext();

//     return (
//         <div className="nproducts">
//             {
//                 products.map((p) => (
//                     p.category == "play"
//                         ?
//                         <div className="fproduct">
//                             <Link to={`/shop/${p.category}/${p.id}`}>
//                                 <div className="fprod-upper">
//                                     <img className="prodimg" src={p.thumbnail} />
//                                     <div className="prod-desc">
//                                         <p className="prod-cat">
//                                             Play
//                                         </p>
//                                         <p className="prod-name">
//                                             {p.name}
//                                         </p>
//                                         <p className="prod-price">
//                                             ₹ {p.price}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </Link>
//                             <div className="fprod-lower">
//                                 <button className="add-cart" onClick={() => { addToCart(p) }} disabled={doingWork ? true : false}  >
//                                     ADD TO CART
//                                 </button>
//                                 <div className="heart-box">
//                                     <img className="heart" src={require("./like.png")} alt="" />
//                                 </div>
//                             </div>
//                         </div>
//                         : null
//                 ))
//             }

//         </div >
//     )
// }


import "./shop.scss";
import products from "./products.json";
import { Link } from "react-router-dom";
import { useUserContext } from "../../UserContext";
import like from "./like.png";
import liked from "./liked.png";
import cartH from "./cartHollow.png";
import cartF from "./cartFilled.png";
import noProduct from "./noProducts.png";

export const Play = () => {
  const { addToCart, doingWork } = useUserContext();
  const playProducts = products.filter((p) => p.category === "play");

  return (
    <div className="nproducts">
      {playProducts.length === 0 ? (
        <div className="noProductDiv">
          <img src={noProduct} className="noProductImg" alt="No Product" />
          {/* No Products Found! */}
        </div>
      ) : (
        <div className="ProductCardRow">
          {playProducts.map((p) => (
            <div className="ProductCard" key={p.id}>
              <div className="imgCont">
                <div className="overlayProdCard">
                  <div className="smallImgCartCont">
                    <img
                      src={cartH}
                      alt="Cart Icon"
                      onMouseOver={(e) => (e.currentTarget.src = cartF)}
                      onMouseOut={(e) => (e.currentTarget.src = cartH)}
                      className="smallBtn"
                    />
                  </div>
                  <div className="smallImgHeartCont">
                    <img
                      src={like}
                      alt="Like Icon"
                      onMouseOver={(e) => (e.currentTarget.src = liked)}
                      onMouseOut={(e) => (e.currentTarget.src = like)}
                      className="smallBtn"
                    />
                  </div>
                </div>
                <Link to={`/shop/${p.category}/${p.id}`}>
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
