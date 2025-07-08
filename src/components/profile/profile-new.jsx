import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebase";
import pencil from "./write.png";
import checkMark from "./check-mark.png";
import "./profile.scss";
import { useContext, useEffect, useState } from "react";
import { UserContext, useUserContext } from "../../UserContext.js";
import PetProfile from "../pet-profile/profile-new";
import { useNavigate } from "react-router-dom";
import { Firestore } from "firebase/firestore";
function ProfileNew() {
  // const usersRef = firestore.collection("users");
  // const [users] = useCollectionData(usersRef);
  // const [userData, setUserData] = useState({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     pan: "",
  //     address: ""
  // });

  // useEffect(() => {
  //     // Ensure the user is authenticated
  //     const currentUser = auth.currentUser;

  //     if (currentUser && users) {
  //         const user = users.find(u => u.uid === currentUser.uid);
  //         if (user) {
  //             setUserData({
  //                 name: user.name,
  //                 email: user.email,
  //                 phone: user.phone,
  //                 pan: user.pan,
  //                 address: user.address
  //             });
  //         }
  //     }
  // }, [users]); // Only run when `users` changes

  const { userData, petData } = useUserContext();
  console.log(userData);
  const navigate = useNavigate();
  const [phone, setPhone] = useState(userData.phone || "");
  const [address, setAddress] = useState(userData.address || "");

  const [editMode, setEditMode] = useState({ phone: false, address: false });

  const handleSave = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));

    const updateData = {};
    if (field === "phone") updateData.phone = phone;
    if (field === "address") updateData.address = address;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No user logged in");
        return;
      }

      const userRef = firestore.collection("users").doc(currentUser.uid);
      userRef.update(updateData);

      console.log(`${field} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Failed to update ${field}. Please try again.`);
    }
  };

  return (
    <div className="ProfileNew">
      <div className="profile-new-box">
        <div className="profileRow1">
          <p className="profile-head">User Profile</p>
          <button
            className="signOutBtn"
            onClick={() => {
              auth.signOut();
              navigate("/");
            }}
          >
            Sign Out
          </button>
        </div>
        <div className="profile-box-dets">
          <div className="profile-box-det">
            <div className="profile-det-head">
              <p className="profile-det-label">Account Name</p>
              <p className="profile-det-text">{userData.name}</p>
            </div>
            <img className="write" src={pencil} alt="Edit" />
          </div>
          <div className="profile-box-det">
            <div className="profile-det-head">
              <p className="profile-det-label">Email</p>
              <p className="profile-det-text">{userData.email}</p>
            </div>
            <img className="write" src={checkMark} alt="Verified" />
          </div>
          <div className="profile-box-det">
            <div className="profile-det-head">
              <p className="profile-det-label">Contact Number</p>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly={!editMode.phone}
                className="profile-det-text"
                placeholder={
                  editMode.phone
                    ? "Enter Phone Number"
                    : "Phone Number Required!"
                }
                style={{
                  minWidth: "80vh",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: editMode.address ? "text" : "default",
                }}
              />
            </div>
            <img
              className="write"
              src={editMode.phone ? checkMark : pencil}
              alt={editMode.phone ? "Save" : "Edit"}
              onClick={() =>
                editMode.phone
                  ? handleSave("phone")
                  : setEditMode((p) => ({ ...p, phone: true }))
              }
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Address - Editable */}
          <div className="profile-box-det">
            <div className="profile-det-head">
              <p className="profile-det-label">My Address</p>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly={!editMode.address}
                className="profile-det-text"
                placeholder={
                  editMode.address ? "Enter Address" : "Address Required!"
                }
                style={{
                  minWidth: "80vh",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: editMode.address ? "text" : "default",
                }}
              />
            </div>
            <img
              className="write"
              src={editMode.address ? checkMark : pencil}
              alt={editMode.address ? "Save" : "Edit"}
              title={editMode.address ? "Save Address" : "Edit Address"}
              onClick={() =>
                editMode.address
                  ? handleSave("address")
                  : setEditMode((p) => ({ ...p, address: true }))
              }
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <br /> <br />
        <PetProfile />
      </div>
    </div>
  );
}

export default ProfileNew;
