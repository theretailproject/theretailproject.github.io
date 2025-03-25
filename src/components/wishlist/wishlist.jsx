import "./wishlist.scss";
import product from "./product.png";
import del from "./delete (1).png";
function Wishlist() {
  return (
    <div className="WishlistComponent">
      <div className="WishlistDiv">
        <div className="WishlistRow1">💚 My Wishlist 💚</div>
        <table className="WishlistTable">
          <thead className="tableHead">
            <tr>
              <th className="ListHead">S. No</th>
              <th className="ListHead">Product Image</th>
              <th className="ListHead">Product Name</th>
              <th className="ListHead">Price</th>
              <th className="ListHead">Stock Status</th>
              <th className="ListHead">What Next?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tableData">
              <td className="ListData">1</td>
              <td className="ListData">
                <img src={product} className="ListImg" />
              </td>
              <td className="ListData">Product Name</td>
              <td className="ListData">Price</td>
              <td className="ListData">Stock Status</td>
              <td className="ListData ">
                <span className="alignCenter">
                  <button className="AddToCartBtn">Add To Cart</button>
                  <img src={del} className="deleteBtn" />
                </span>
              </td>
            </tr>
            <tr className="tableData">
              <td className="ListData">2</td>
              <td className="ListData">
                <img src={product} className="ListImg" />
              </td>
              <td className="ListData">Product Name</td>
              <td className="ListData">Price</td>
              <td className="ListData">Stock Status</td>
              <td className="ListData ">
                <span className="alignCenter">
                  <button className="AddToCartBtn">Add To Cart</button>
                  <img src={del} className="deleteBtn" />
                </span>
              </td>
            </tr>
            <tr className="tableData">
              <td className="ListData">3</td>
              <td className="ListData">
                <img src={product} className="ListImg" />
              </td>
              <td className="ListData">Product Name</td>
              <td className="ListData">Price</td>
              <td className="ListData">Stock Status</td>
              <td className="ListData ">
                <span className="alignCenter">
                  <button className="AddToCartBtn">Add To Cart</button>
                  <img src={del} className="deleteBtn" />
                </span>
              </td>
            </tr>
            <tr className="tableData">
              <td className="ListData">4</td>
              <td className="ListData">
                <img src={product} className="ListImg" />
              </td>
              <td className="ListData">Product Name</td>
              <td className="ListData">Price</td>
              <td className="ListData">Stock Status</td>
              <td className="ListData ">
                <span className="alignCenter">
                  <button className="AddToCartBtn">Add To Cart</button>
                  <img src={del} className="deleteBtn" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Wishlist;
