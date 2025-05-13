import { useState, useEffect } from "react";
import { auth, firestore, firebase } from "../../firebase";
import { useUserContext } from "../../UserContext";
import "./checkout.scss";
import { useNavigate } from "react-router-dom";
// import { useBlocker } from "./useBlocker";

const CheckoutBuyNow = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // required for Chrome to trigger alert
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  // const navigate = useNavigate();

  // useBlocker((tx) => {
  //   setShowConfirmOverlay(true);
  //   setPendingNavigation(() => tx);
  // }, true);

  const handleCancelBack = () => {
    setShowConfirmOverlay(false);
    if (pendingNavigation) {
      pendingNavigation.retry(); // allow the navigation
    }
  };

  const handleStay = () => {
    setShowConfirmOverlay(false); // stay on page
  };
  const { userData, doingWork, setDoingWork, cartData, setCartData, buynow } =
    useUserContext();
  console.log(cartData);
  const updatedata = (e) => {
    const { name, value } = e.target;
    firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .update(
        {
          [name]: value,
        },
        { merge: true }
      );
  };

  const [tip, setTip] = useState(0);
  const [ctip, setCtip] = useState(""); // Make sure it's an empty string initially
  const [calculatedTip, setCalculatedTip] = useState(0);

  const calculateTip = async () => {
    setDoingWork(true);

    let finalTip = 0;

    if (
      (tip === 10 || tip === 20 || tip === 30) &&
      (!ctip || Number(ctip) === 0)
    ) {
      finalTip = (tip / 100) * userData.checkoutAmt;
    } else if (tip === 0 && Number(ctip) > 0) {
      finalTip = Number(ctip);
    } else {
      finalTip = 0;
    }

    setCalculatedTip(finalTip);
    setDoingWork(false);
  };

  const setCustomTip = (e) => {
    const value = e.target.value;
    setCtip(value);
    setTip(0); // Ensure predefined tip selection is removed when custom tip is entered
  };

  const [printing, setPrinting] = useState(false);

  const handlePayment = async (e, bprice) => {
    e.preventDefault();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      const options = {
        key: "rzp_test_OyYjB1Y3qxyCgn", // Replace with actual Razorpay Key ID
        amount: Number(bprice) * 100, // Amount in paisa
        currency: "INR",
        name: "The ReTail Project",
        description: "Pet Products",
        prefill: {
          email: userData.email,
          contact: userData.phone,
        },
        handler: async function (response) {
          console.log("Payment successful, processing order...");

          // Pass the payment ID to proceedToPay
          await proceedToPay(response.razorpay_payment_id);
          alert("Payment done!!");
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    document.body.appendChild(script);
  };

  const proceedToPay = async (paymentId) => {
    if (buynow) {
      console.log("Starting proceedToPay with Payment ID:", paymentId);

      for (const cd of buynow) {
        const orderId = firestore
          .collection("users")
          .doc(auth.currentUser?.uid)
          .collection("orders")
          .doc().id;
        console.log("Generated orderId:", orderId);

        try {
          await firestore
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("orders")
            .doc(orderId)
            .set({
              orderId: orderId,
              paymentId: paymentId, // Store actual payment ID from Razorpay
              itemId: cd.itemId,
              name: cd.name,
              price: cd.price,
              quantity: cd.quantity,
              thumbnail: cd.thumbnail,
              link: cd.link,
              status: "Processing",
              orderedAt: firebase.firestore.Timestamp.now(),
              type: "Processing",
            });

          console.log("Order added for item:", cd.itemId);

          if (userData.checkoutAmt > 0) {
            await firestore
              .collection("users")
              .doc(auth.currentUser?.uid)
              .update(
                {
                  checkoutAmt: 0,
                },
                { merge: true }
              );
          }

          await firestore
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("buynow")
            .doc("current")
            .delete();
          console.log("Cart item deleted for item:", cd.itemId);
        } catch (error) {
          console.error("Error processing order:", error);
        }
      }
navigate("/orders")
      console.log("All orders processed.");
    }
  };
  const isFormValid = () => {
    const { name, address, pincode } = userData;
    return name && address && pincode;
  };

  const handleCancel = async () => {
    const snapshot = await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("buynow")
      .get();

    const batch = firestore.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Optional: reset checkoutAmt if needed
    await firestore.collection("users").doc(auth.currentUser?.uid).update({
      checkoutAmt: 0,
    });

    navigate("/shop"); // or wherever you want to go after cancel
  };

  return (
    <div className="CheckoutNew">
      {showConfirmOverlay && (
        <div className="overlay">
          <div className="overlay-box">
            <p>Are you sure you want to cancel the order?</p>
            <button
              onClick={() => {
                handleCancelBack();
                handleCancel();
              }}
            >
              Yes, Cancel
            </button>

            <button onClick={handleStay}>No, Stay</button>
          </div>
        </div>
      )}
      <p className="checkout-h">Checkout</p>
      {userData.checkoutAmt > 0 ? (
        <div className="checkout-container">
          <div className="checkout-box">
            <form action="" className="personal-dets">
              <p className="check-head">Shipping Details</p>
              <input
                type="text"
                className="check-input"
                value={userData.name}
                name="name"
                onChange={updatedata}
                placeholder="Name"
                required
              />
              <input
                type="email"
                className="check-input"
                name="email"
                value={userData.email}
                onChange={updatedata}
                placeholder="E-mail address"
                disabled
                required
              />
              <input
                type="number"
                className="check-input"
                name="phone"
                value={userData.phone}
                onChange={updatedata}
                placeholder="Phone number"
                disabled
                required
              />
              <input
                type="text"
                className="check-input"
                name="address"
                value={userData.address}
                onChange={updatedata}
                placeholder="Full Address"
                required
              />
              <input
                type="number"
                className="check-input"
                name="pincode"
                value={userData.pincode}
                onChange={updatedata}
                placeholder="Pincode"
                required
              />
            </form>

            <div className="personal-dets">
              <p className="check-head">Add tip</p>
              <p className="tip-text">
                Show your support for the team at The ReTail Project
              </p>
              <div className="tip-box">
                {[0, 10, 20, 30].map((tipValue) => (
                  <p
                    key={tipValue}
                    className={
                      tip === tipValue ? "tip-per active-tip" : "tip-per"
                    }
                    onClick={() => {
                      setTip(tipValue);
                      setCtip(""); // Reset custom tip when selecting predefined tip
                    }}
                  >
                    {tipValue}%
                  </p>
                ))}
              </div>
              <input
                className="tip-input"
                value={ctip}
                onChange={setCustomTip}
                type="number"
                placeholder="Custom tip (₹)"
              />
              <button
                className="add-tip"
                onClick={calculateTip}
                disabled={doingWork}
              >
                Add tip - {tip > 0 ? `${tip}%` : `₹ ${ctip}`}
              </button>
              <p className="tip-text">Thanks, we appreciate!</p>
            </div>
          </div>
          <div className="checkout-box">
            <div className="personal-dets">
              <p className="check-head">Order Details</p>
              <div className="payment-info">
                {buynow && buynow.length > 0
                  ? buynow.map((order, index) => (
                      <div key={index} className="order-row">
                        <p className="payiname">{order.name}</p>
                        <img
                          src={order.thumbnail}
                          className="orderImg"
                          alt={order.name}
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>
            <div className="personal-dets">
              <p className="check-head">Payment Info</p>
              <div className="payment-info">
                <div className="payi">
                  <p className="payiname">Items</p>
                  <p className="payival">₹ {userData.checkoutAmt}</p>
                </div>
                <div className="payi">
                  <p className="payiname">Delivery charges</p>
                  <p className="payival">₹ 80</p>
                </div>
                <div className="payi">
                  <p className="payiname">Tip</p>
                  <p className="payival">₹ {calculatedTip}</p>
                </div>
                <div className="payi">
                  <p className="payiname">Total</p>
                  <p className="payival">
                    ₹ {userData.checkoutAmt + 80 + calculatedTip}
                  </p>
                </div>
                <button
                  className="pay-button"
                  onClick={(e) => {
                    if (!isFormValid()) {
                      document.getElementById("errorDiv").innerHTML =
                        "Please add all the details before proceeding!";
                      return;
                    } else {
                      handlePayment(
                        e,
                        userData.checkoutAmt + 80 + calculatedTip
                      );
                      document.getElementById("errorDiv").innerHTML = "";
                    }
                  }}
                >
                  Proceed to Pay
                </button>
                <p className="errorLine" id="errorDiv"></p>
                <button className="cancelBuyNow" onClick={handleCancel}>
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Add items in cart to checkout</p>
      )}
    </div>
  );
};

export default CheckoutBuyNow;
