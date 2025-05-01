import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "./firebase"; // Ensure Firebase is correctly configured
import { onAuthStateChanged } from "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { doc, deleteDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState(auth.currentUser?.uid);
  const [petData, setPetData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [checkoutAmt, setCheckoutAmt] = useState(0);

  const [doingWork, setDoingWork] = useState(false);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      if (uid) {
        try {
          // Fetch user data
          const userDoc = await firestore.collection("users").doc(uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();

            setUserData(userData);

            // const unsubscribeCheckoutAmt = userDoc.onSnapshot((doc) => {
            //     if (doc.exists) {
            //         const data = doc.data();
            //         setCheckoutAmt(data.checkoutAmt || 0);
            //     }
            // });

            // Fetch pet data from subcollection
            const petsSnapshot = await firestore
              .collection("users")
              .doc(uid)
              .collection("pets")
              .get();
            const fetchedPets = petsSnapshot.docs.map((doc) => doc.data());
            setPetData(fetchedPets);

            // Fetch order data from subcollection
            const ordersSnapshot = await firestore
              .collection("users")
              .doc(uid)
              .collection("orders")
              .get();
            const fetchedOrders = ordersSnapshot.docs.map((doc) => doc.data());
            setOrderData(fetchedOrders);

            const cartSnapshot = await firestore
              .collection("users")
              .doc(uid)
              .collection("cart")
              .get();
            const fetchCartData = await cartSnapshot.docs.map((doc) =>
              doc.data()
            );
            setCartData(fetchCartData);

            const checkoutAmtRef = firestore.collection("users").doc(uid);
            checkoutAmtRef.onSnapshot((doc) => {
              if (doc.exists) {
                const updatedUserData = doc.data();
                setUserData(updatedUserData);
              }
            });

            const cartDataRef = firestore
              .collection("users")
              .doc(uid)
              .collection("cart");
            cartDataRef.onSnapshot((doc) => {
              if (doc.exists) {
                const updatedCartData = doc.data();
                setCartData(updatedCartData);
              }
            });

            const orderRef = firestore
              .collection("users")
              .doc(uid)
              .collection("orders");
            orderRef.onSnapshot((snapshot) => {
              const updatedOrders = snapshot.docs.map((doc) => doc.data()); // No need to include doc.id
              setOrderData(updatedOrders);
            });
          }
        } catch (error) {
          console.error("Error fetching user or pet data:", error);
        }
      } else {
        console.warn("User ID is not available.");
      }
    };

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid); // Fetch user data when authenticated
      } else {
        // Reset state when user is logged out
        setUserData({
          name: "",
          email: "",
          phone: "",
          pan: "",
          address: "",
          checkoutAmt: 0,
        });
        setPetData([]); // Clear pet data when user is logged out
        setOrderData([]); // Clear order data when user is logged out
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []); // Run only once when the component mounts

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      setWishlist([]);
      return;
    }

    const cartRef = firestore
      .collection("users")
      .doc(currentUser)
      .collection("cart");

    const wishlistRef = firestore
      .collection("users")
      .doc(currentUser)
      .collection("wishlist");

    const unsubscribeCart = cartRef.onSnapshot((snapshot) => {
      const cartItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCart(cartItems);
    });

    const unsubscribeWishlist = wishlistRef.onSnapshot((snapshot) => {
      const wishlistItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlist(wishlistItems);
    });

    // Cleanup both listeners on unmount or user change
    return () => {
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, [currentUser]);

  const addToCart = async (p) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return alert("You must be logged in to add items.");

    const existsInCart = cart?.some((product) => product.itemId === p.itemId);
    const existsInWishlist = wishlist?.some(
      (product) => product.itemId === p.itemId
    );

    if (existsInCart) {
      return alert("Item is already in cart. Increase quantity in cart.");
    }

    if (existsInWishlist) {
      return alert(
        "Item is already in wishlist. You may want to move it to cart."
      );
    }

    setDoingWork(true);

    try {
      const cartProdId = firestore
        .collection("users")
        .doc(uid)
        .collection("cart")
        .doc().id;

      await firestore
        .collection("users")
        .doc(uid)
        .collection("cart")
        .doc(cartProdId)
        .set({
          docId: cartProdId,
          name: p.name,
          thumbnail: p.thumbnail,
          link: `/shop/${p.category}/${p.itemId}`,
          price: p.price,
          quantity: 1,
          itemId: p.itemId,
          category: p.category,
          color: p.color || "default",
          size: p.size || "default",
        });

      const newAmt = (userData?.checkoutAmt || 0) + Number(p.price);
      setCheckoutAmt(newAmt);

      await firestore.collection("users").doc(uid).update({
        checkoutAmt: newAmt,
      });

      // alert("Product added to cart.");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Could not add to cart.");
    } finally {
      setDoingWork(false);
    }
  };

  const addToWishlist = async (p) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return alert("You must be logged in to add items.");

    const existsInWishlist = wishlist?.some(
      (product) => product.itemId === p.itemId
    );
    const existsInCart = cart?.some((product) => product.itemId === p.itemId);

    if (existsInWishlist) {
      return alert("Item is already in wishlist.");
    }

    if (existsInCart) {
      return alert(
        "Item is already in cart. You may want to move it to wishlist."
      );
    }

    setDoingWork(true);

    try {
      const wishlistProdId = firestore
        .collection("users")
        .doc(uid)
        .collection("wishlist")
        .doc().id;

      await firestore
        .collection("users")
        .doc(uid)
        .collection("wishlist")
        .doc(wishlistProdId)
        .set({
          docId: wishlistProdId,
          name: p.name,
          thumbnail: p.thumbnail,
          link: `/shop/${p.category}/${p.itemId}`,
          price: p.price,
          quantity: 1,
          itemId: p.itemId,
          category: p.category,
          color: p.color || "default",
          size: p.size || "default",
        });

      // alert("Product added to wishlist.");
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      alert("Could not add to wishlist.");
    } finally {
      setDoingWork(false);
    }
  };

  const delFromWishlist = async (p) => {
    setDoingWork(true);

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("Please login to perform this action.");
      setDoingWork(false);
      return;
    }

    try {
      const wishlistRef = firestore
        .collection("users")
        .doc(userId)
        .collection("wishlist");

      // Attempt to find the item by itemId if docId is not available
      const snapshot = await wishlistRef.where("itemId", "==", p.itemId).get();

      if (snapshot.empty) {
        console.warn("No matching item found in wishlist to delete.");
        alert("Item not found in wishlist.");
        setDoingWork(false);
        return;
      }

      const docToDelete = snapshot.docs[0];
      await wishlistRef.doc(docToDelete.id).delete();

      console.log("Deleted from wishlist:", p.name);
      // Optionally show a toast/alert
      // alert("Removed from wishlist.");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove item from wishlist.");
    } finally {
      setDoingWork(false);
    }
  };

  const delFromCart = async (c) => {
    setDoingWork(true);

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("Please login to perform this action.");
      setDoingWork(false);
      return;
    }

    try {
      const cartRef = firestore
        .collection("users")
        .doc(userId)
        .collection("cart");

      // Attempt to find the item by itemId
      const snapshot = await cartRef.where("itemId", "==", c.itemId).get();

      if (snapshot.empty) {
        console.warn("No matching item found in cart to delete.");
        alert("Item not found in cart.");
        setDoingWork(false);
        return;
      }

      const docToDelete = snapshot.docs[0];
      await cartRef.doc(docToDelete.id).delete();

      // Update checkout amount
      const updatedAmt = userData.checkoutAmt - Number(c.price || 0);
      setCheckoutAmt(updatedAmt);

      await firestore.collection("users").doc(userId).update({
        checkoutAmt: updatedAmt,
      });

      console.log("Deleted from cart:", c.name);
      // Optionally show a toast/alert
      // alert("Removed from cart.");
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item from cart.");
    } finally {
      setDoingWork(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        petData,
        orderData,
        cartData,
        addToCart,
        checkoutAmt,
        setCheckoutAmt,
        doingWork,
        setDoingWork,
        setCartData,
        addToWishlist,
        delFromWishlist,
        delFromCart,
      }}
    >
      {children} {/* Ensure data is loaded before rendering children */}
    </UserContext.Provider>
  );
};

// Custom hook for using the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
