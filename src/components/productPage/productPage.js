// 


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

function ProductPage() {
  const { addToCart, doingWork } = useUserContext();

  const { pid } = useParams();

  const [currentImg, setCurrentImg] = useState(() => {
    const product = products.find((product) => product.id == pid);
    return product ? product.thumbnail : null;
  });

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

  return (
    <div className="MainDiv">
      {products.map((p) =>
        p.id == pid ? (
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

                <div className="product-page-buttons">
                  <span className="product-page-buttons-row1">
                    <button
                      onClick={() => {
                        addToCart(p);
                      }}
                      className="pp-button"
                      disabled={doingWork ? true : false}
                    >
                      <img src={like} className="btnSmallImg heart-icon" />
                      Add to Wishlist
                    </button>
                    <button
                      onClick={() => {
                        addToCart(p);
                      }}
                      className="pp-button"
                      disabled={doingWork ? true : false}
                    >
                      <img src={cartH} className="btnSmallImg cart-icon" />
                      Add to Cart
                    </button>
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
      )}
    </div>
  );
}

export default ProductPage;
