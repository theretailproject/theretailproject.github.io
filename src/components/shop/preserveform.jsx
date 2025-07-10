import "./preserveform.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useUserContext } from "../../UserContext";
import { useNavigate, Link } from "react-router-dom";
import productsh from "./preserveprodhumans.json";
import productsp from "./preserveprodpets.json";
function PreserveForm() {
  const navigate = useNavigate();
  const { updateBuyListPreserve, delFromBuyListPreserve } = useUserContext();
  const [selectedSize, setSelectedSize] = useState("Small");
  const [basePrice, setBasePrice] = useState(0);
  const [prodDimensions, setProdDimensions] = useState("");
  const [clothesLen, setClothesLen] = useState("");
  // const [prodDimension, setClothesReq] = useState("");
  const [clothDimensions, setClothesDimensions] = useState("");

  const [clothesReq, setClothesReq] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [customPrice, setCustomPrice] = useState(0);
  const [agreeGuidelines, setAgreeGuidelines] = useState(false);
  const [selfDelivery, setSelfDelivery] = useState(false);

  const { pid } = useParams();
  const secretKey = "TRPSECURITYKEY@88";

  const [decryptedId, setDecryptedId] = useState(pid);
  const [currentProd, setCurrProd] = useState({});
  const [selectedOptionName, setSelectedOptionName] = useState("");

  // useEffect(() => {
  //   if (pid) {
  //     try {
  //       const cleanPid = decodeURIComponent(pid);
  //       const bytes = CryptoJS.AES.decrypt(cleanPid, secretKey);
  //       const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  //       console.log("Decrypted PID:", decrypted);
  //     } catch (err) {
  //       console.error("Failed to decrypt", err);
  //     }
  //   }
  // }, [pid]);

  useEffect(() => {
    if (decryptedId) {
      const humanProd = productsh.find((prod) => prod.itemId === decryptedId);
      const petProd = productsp.find((prod) => prod.itemId === decryptedId);

      if (humanProd) {
        setCurrProd(humanProd);
      } else if (petProd) {
        setCurrProd(petProd);
      } else {
        console.warn("No matching product found for ID:", decryptedId);
      }
    }
    console.log(currentProd);
  }, [decryptedId]);

  useEffect(() => {
    const selectedOption = currentProd?.options?.find(
      (opt) => opt.opname === selectedOptionName
    );
    setClothesLen(selectedOption ? parseInt(selectedOption.length || 0) : 0);
    setProdDimensions(
      selectedOption ? parseInt(selectedOption.dimensions || 0) : 0
    );
    setClothesDimensions(
      selectedOption ? selectedOption.clothDimensions || " 1m X 1m " : 0
    );

    setBasePrice(selectedOption ? parseInt(selectedOption.price) : 0);
    setClothesReq(selectedOption ? selectedOption.clothesrequired : "");
  }, [selectedOptionName, currentProd]);

  useEffect(() => {
    setCustomPrice(customNote.trim() ? 50 : 0);
  }, [customNote]);

  const finalPrice = basePrice + customPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeGuidelines || !selfDelivery) return;
    const preserveProduct = {
      itemId: currentProd.itemId,
      thumbnail:currentProd.thumbnail,
      category:"preserve",
      name: currentProd.name,
      option: selectedOptionName,
      price: finalPrice,
      dimensions: prodDimensions,
      clothDimension: clothDimensions,
      clothesReq: clothesReq,
      selectedQty: 1,
      customNote: customNote,
      agreeGuidelines:true,
      selfDelivery:true
    };

    updateBuyListPreserve(preserveProduct);
    // Replace with Razorpay or Firebase logic later
    navigate("/checkoutbuynow")
  };

  return (
    <div className="PFormContainer">
      <h2 className="center PFormPageHeading">
        Customize Your Memory Keepsake
      </h2>
      {currentProd ? (
        <>
          {/* Product Display */}
          <div className="PFormSection PFormRow1">
            <img
              src={currentProd.thumbnail}
              alt="Product"
              className="PFormImage"
            />
            <p className="PFormProductName">{currentProd.name}</p>
          </div>

          {/* Size Selection */}
          <div className="PFormSection">
            <p className="PFormHeading">Choose Option:</p>
            <select
              value={selectedOptionName}
              onChange={(e) => setSelectedOptionName(e.target.value)}
              className="PFormSelect"
            >
              <option value="">-- Select --</option>
              {currentProd?.options?.map((opt) => (
                <option key={opt.opname} value={opt.opname}>
                  {opt.opname}-{opt.dimensions} - ₹{opt.price}
                </option>
              ))}
            </select>
          </div>

          {/* Customization Note */}
          <div className="PFormSection">
            <p className="PFormHeading">Customization Details (Optional):</p>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows="4"
              placeholder="E.g., Include pet's name, color preferences, etc."
              className="PFormTextArea"
            />
            {customNote.trim() && (
              <p className="PFormPrice">+ ₹50 customization charge</p>
            )}
          </div>

          {/* Guidelines Section */}
          <div className="PFormSection">
            <p className="PFormHeading">Minimum Requirements</p>
            <ul className="PFormGuidelines">
              <li>Clothes must be clean and ironed</li>
              <li>
                Minimum fabric length: <strong>{clothesLen}</strong>
              </li>
              <li>
                Clothes Required: <strong>{clothesReq}</strong>{" "}
              </li>
              <li>No torn or damaged material</li>
              <li>
                Delivery must be made within <strong>7 days</strong>
              </li>
            </ul>
            <label className="PFormLabel">
              <input
                type="checkbox"
                checked={agreeGuidelines}
                onChange={() => setAgreeGuidelines(!agreeGuidelines)}
              />{" "}
              I have read and agree to the above requirements
            </label>
          </div>

          {/* Delivery */}
          <div className="PFormSection">
            <label className="PFormLabel">
              <input
                type="checkbox"
                checked={selfDelivery}
                onChange={() => setSelfDelivery(!selfDelivery)}
              />{" "}
              I will deliver the clothes myself to:{" "}
              <strong>XYZ Center, Delhi</strong>
            </label>
          </div>

          {/* Final Summary */}
          <div className="PFormSection">
            <p className="PFormHeading center">Total: ₹{finalPrice}</p>
           
              {" "}
              <button
                className={`PFormButton ${
                  agreeGuidelines && selfDelivery && basePrice != 0
                    ? "enabled"
                    : "disabled"
                }`}
                disabled={!(agreeGuidelines && selfDelivery)}
                onClick={handleSubmit}
              >
                Proceed to Pay
              </button>
            
          </div>
        </>
      ) : null}
    </div>
  );
}

export default PreserveForm;
