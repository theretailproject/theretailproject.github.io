import "./preserveopt.scss";
import { Link } from "react-router-dom";
import products from "./preserveprodpets.json";
import defaultImg from "./Images/default.png";
import CryptoJS from "crypto-js";
function PreserveForPet() {
  return (
    <div className="Preserve-Container">
      <div className="Preserve-Content">
        <p className="Preserve-Heading">For Your Pet</p>
        <div className="Preserve-Choice-Boxes">
          {products &&
            products.map((product) => {
              const secretKey = "TRPSECURITYKEY@88"; // Keep this consistent
              const encryptedId = CryptoJS.AES.encrypt(
                product.itemId.toString(),
                secretKey
              ).toString();

              return (
                /*<Link
                  key={product.itemId}
                  to={`/shop/preserve/form/${encodeURIComponent(encryptedId)}`}
                >*/
                <Link
                  key={product.itemId}
                  to={`/shop/preserve/form/${product.itemId}`}
                >
                  <div className="Preserve-Choice-Box">
                    <img
                      src={product.thumbnail}
                      className="Preserve-Choice-Box-Img"
                      alt={product.name}
                    />
                    <p className="Preserve-Choice-Box-Text">{product.name}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default PreserveForPet;
