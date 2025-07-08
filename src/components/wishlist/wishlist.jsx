import "./wishlist.scss";
import product from "./product.png";
import { useUserContext } from "../../UserContext";
import del from "./delete (1).png";
import { auth, firestore, firebase } from "../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import cartImg from "./cartImg.png";
import Popup from "../popup/popup";

function Wishlist() {
  const {
    addToCart,
    doingWork,
    delFromWishlist,
    productAdded,
    setProductAdded,
    wishAdded,
    setWishAdded,
  } = useUserContext();
  const wishlistRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("wishlist");
  const [products] = useCollectionData(wishlistRef);
  console.log(products);
  return (
    <div className="WishlistComponent">
      <div className="WishlistDiv">
        <div className="WishlistRow1">My Wishlist </div>
        {productAdded && (
          <Popup
            message={`Product added to Cart!`}
            onClose={() => setProductAdded(false)}
          />
        )}
        <table className="WishlistTable">
          <thead className="tableHead">
            <tr>
              <th className="ListHead">Product Image</th>
              <th className="ListHead">Product Name</th>
              <th className="ListHead">Product Description</th>
              <th className="ListHead">Price</th>
              <th className="ListHead">Quantity</th>
              <th className="ListHead">What Next?</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length === 0 ? (
              <tr>
                <td colSpan="6" className="tableData ListData">
                  No Products in Wishlist!
                </td>
              </tr>
            ) : (
              products &&
              products.map((product) => {
                console.log(product);
                return (
                  <tr key={product.itemId} className="tableData">
                    <td className="ListData">
                      <Link to={`shop/${product.category}/${product.itemId}`}>
                        <img
                          src={product.thumbnail}
                          className="ListImg"
                          alt={product.name}
                        />
                      </Link>
                    </td>
                    <td className="ListData">
                      <Link to={`shop/${product.category}/${product.itemId}`}>
                        {product.name}
                      </Link>
                    </td>
                    <td className="ListData">
                      Color: {product.color}, Size: {product.size}
                    </td>
                    <td className="ListData">₹ {product.price}</td>
                    <td className="ListData">{product.quantity}</td>
                    <td className="ListData">
                      <span className="alignCenter">
                        <button
                          className="AddToCartBtn"
                          onClick={() => addToCart(product)}
                        >
                          Add To Cart
                        </button>

                        <img
                          src={cartImg}
                          className="AddToCartBtnImg"
                          title="Add to Cart"
                          onClick={() => addToCart(product)}
                        />

                        <img
                          src={del}
                          className="deleteBtn"
                          alt="Delete"
                          title="Remove Product"
                          onClick={() => delFromWishlist(product)}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="WishlistCards">
          {products && products.length === 0 ? (
            <p className="ListDataSmall bold">No Products in Wishlist</p>
          ) : (
            products &&
            products.map((product) => (
              <div className="WishlistCard">
                <img src={product.thumbnail} className="WishlistImg" />
                <div className="WishlistInfo">
                  <p className="ListDataSmall bold">{product.name}</p>
                  <p className="ListDataSmall">
                    Color: {product.color}, Size: {product.size}
                  </p>
                  <p className="ListDataSmall">Price: ₹ {product.price}</p>
                  <p className="ListDataSmall">
                    Qty:{" "}
                    {product.quantity > 1
                      ? `${product.quantity} pcs`
                      : `${product.quantity} pc`}
                  </p>{" "}
                  <div className="ListDataSmall">
                    <span className="alignCenter">
                      <button
                        className="AddToCartBtn"
                        onClick={() => addToCart(product)}
                      >
                        Add To Cart
                      </button>
                      <img
                        src={cartImg}
                        className="AddToCartBtnImg"
                        onClick={() => addToCart(product)}
                      />
                      <img
                        src={del}
                        className="deleteBtn"
                        alt="Delete"
                        onClick={() => delFromWishlist(product)}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
