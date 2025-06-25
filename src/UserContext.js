import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "./firebase"; // Ensure Firebase is correctly configured
import { onAuthStateChanged } from "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { doc, deleteDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [productAdded, setProductAdded] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);
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
              const updatedOrders = snapshot.docs.map((doc) => doc.data());
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
        fetchUserData(user.uid);
      } else {
        setUserData({
          name: "",
          email: "",
          phone: "",
          pan: "",
          address: "",
          checkoutAmt: 0,
        });
        setPetData([]);
        setOrderData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const cartRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("cart");
  const [cart] = useCollectionData(cartRef);

  const wishlistRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("wishlist");
  const [wishlist] = useCollectionData(wishlistRef);

  const addToCart = async (p) => {
    const cartProdId = firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("cart")
      .doc().id;

    if (cart && cart.some((product) => product.itemId == p.itemId)) {
      alert("Item is already in cart, increase quantity in cart");
    } else {
      await setDoingWork(true);
      await firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("cart")
        .doc(cartProdId)
        .set({
          docId: cartProdId,
          name: p.name,
          thumbnail: p.thumbnail,
          link: `/shop/${p.category}/${p.itemId}`,
          price: p.price,
          quantity: p.quantity || 1,
dimensions:p.dimensions,
          size: p.size || "default",
          color: p.color || "default",
          itemId: p.itemId,
          category: p.category,
        })
        .then(async () => {
          const newAmt = userData.checkoutAmt + Number(p.price);
          setCheckoutAmt(newAmt);
          await firestore.collection("users").doc(auth.currentUser?.uid).update(
            {
              checkoutAmt: newAmt,
            },
            { merge: true }
          );
          await setDoingWork(false);
          setProductAdded(true);
          // Automatically reset after 3s (optional — could be controlled by <Popup /> too)
          setTimeout(() => setProductAdded(false), 5000);
        });
    }
  };

  const buyListRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("buynow");
  const [buynow] = useCollectionData(buyListRef);

  const updateBuyList = async (p) => {
    const buyNowId = "current"; // Fixed ID to always overwrite the single doc
    console.log("Product object (p):", p);

    await setDoingWork(true);

    await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("buynow")
      .doc(buyNowId)
      .set({
        docId: buyNowId,
        name: p.name || "random",
        thumbnail: p.thumbnail || "product",
        link: `/shop/${p.category}/${p.itemId}`,
        price: p.price,
        quantity: p.selectedQty || 1,
        dimensions:p.dimensions,

        orderPrice: p.price * (p.selectedQty || 1),
        size: p.selectedSize || "default",
        color: p.selectedColor || "default",
        itemId: p.itemId,
        category: p.category,
      })
      .then(async () => {
        const newAmt = p.price * (p.selectedQty || 1);
        setCheckoutAmt(newAmt);

        await firestore.collection("users").doc(auth.currentUser?.uid).update(
          {
            checkoutAmt: newAmt,
          },
          { merge: true }
        );

        // alert("Product added to buy list.");
        await setDoingWork(false);
      })
      .catch((error) => {
        console.error("Error updating buynow:", error);
        alert("Failed to update buy list.");
        setDoingWork(false);
      });
  };

  const delFromBuyList = async (p) => {
    setDoingWork(true);
    // console.log("Delete btn clicked.");

    const userId = auth.currentUser?.uid;
    const productId = p?.itemId;

    const currentDocId = buynow?.map((pr) =>
      pr.itemId === p.itemId ? pr.docId : null
    );
    console.log(currentDocId);
    try {
      const productRef = doc(
        firestore,
        "users",
        userId,
        "buynow",
        currentDocId[0]
      );
      console.log("Firestore document path:", productRef.path);

      await deleteDoc(productRef).then(() =>
        // alert("Product removed from Wishlist")
        setDoingWork(false)
      );
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      alert("Failed to remove product from wishlist");
    } finally {
      await setDoingWork(false);
    }

    console.log("Product removed from wishlist");
  };

  const addToWishlist = async (p) => {
    console.log("wish:",p);
    const wishlistProdId = firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection("wishlist")
      .doc().id;

    if (
      wishlist &&
      wishlist.length > 0 &&
      wishlist.some((product) => product.itemId == p.itemId)
    ) {
      alert("Item is already in wishlist, increase quantity in wishlist");
    } else {
      await setDoingWork(true);
      await firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("wishlist")
        .doc(wishlistProdId)
        .set({
          docId: wishlistProdId,
          name: p.name,
          thumbnail: p.thumbnail,
          link: `/shop/${p.category}/${p.itemId}`,
          price: p.price,
          quantity: p.quantity || 1,
          dimensions:p.dimensions ,

          size: p.size || "default",
          color: p.color || "default",
          itemId: p.itemId,
          category: p.category,
        })
        .then(async () => {
          setWishAdded(true);
          await setDoingWork(false);
          setTimeout(() => setWishAdded(false), 5000);
        });
    }
  };

  const delFromWishlist = async (p) => {
    setDoingWork(true);
    // console.log("Delete btn clicked.");

    const userId = auth.currentUser?.uid;
    const productId = p?.itemId;
    console.log(p);
    console.log("User ID:", userId);
    console.log("Product ID:", productId);
    console.log("Wishlist:", wishlist);

    if (!userId) {
      console.error("User ID is undefined. Ensure the user is authenticated.");
      return;
    }

    if (!productId) {
      console.error("Invalid product ID:", productId);
    }

    if (
      !wishlist ||
      !wishlist.some((product) => product.itemId === productId)
    ) {
      console.error("Product not found in wishlist.");
      return;
    }

    const currentDocId = wishlist?.map((pr) =>
      pr.itemId === p.itemId ? pr.docId : null
    );
    console.log(currentDocId);
    try {
      const productRef = doc(
        firestore,
        "users",
        userId,
        "wishlist",
        currentDocId[0]
      );
      console.log("Firestore document path:", productRef.path);

      await deleteDoc(productRef).then(() =>
        // alert("Product removed from Wishlist")
        setDoingWork(false)
      );
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      alert("Failed to remove product from wishlist");
    } finally {
      await setDoingWork(false);
    }

    console.log("Product removed from wishlist");
  };

  const delFromCart = async (c) => {
    await setDoingWork(true);
    console.log("Cart from product: ", c);
    console.log("Cart from cart list: ", cart);
    const currentDocId = cart?.map((pr) =>
      pr.itemId === c.itemId ? pr.docId : null
    );
    console.log(currentDocId);
    try {
      const productRef = doc(
        firestore,
        "users",
        auth?.currentUser.uid,
        "cart",
        currentDocId[0]
      );
      console.log("Firestore document path:", productRef.path);

      await deleteDoc(productRef).then(() =>
        // alert("Product removed from Wishlist")
        setDoingWork(false)
      );
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      alert("Failed to remove product from wishlist");
    } finally {
      await setDoingWork(false);
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
        updateBuyList,
        buynow,
        delFromBuyList,
        productAdded,
        setProductAdded,
        wishAdded,
        setWishAdded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
