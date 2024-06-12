import { useState } from "react";
import "./Detail.css";
import { auth, db } from "../../Lib/firebase";
import { useChatSotre } from "../../Lib/chatStore";
import { useUserSotre } from "../../Lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const [click, setClick] = useState(false);
  const { chatId, user, isCurrUserBlocked, isReceiverBlocked, changeBlock } =
    useChatSotre();

  const { currUser } = useUserSotre();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {}
  };
  return (
    <div className="Detail">
      <div className="user">
        <img src={user?.avatar || "./blocked.png"} alt="User Image" />
        <h2>{user?.name}</h2>
        <p>
          Hi {currUser?.name}, I am {user?.name}
        </p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chats Setting</span>
            <img src="./arrowUp.png" alt="Arrow Up Icon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="Arrow Up Icon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photo</span>
            <img
              src={click ? "./arrowDown.png" : "./arrowUp.png"}
              alt="Arrow Up Icon"
              onClick={() => setClick((prev) => !prev)}
            />
          </div>

          <div
            className="photos"
            style={{ display: `${click ? "block" : "none"}` }}
          >
            <div className="photo-item">
              <div className="photo-details">
                <img src="./bg.jpg" alt="Image" />
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photo-item">
              <div className="photo-details">
                <img src="./bg.jpg" alt="Image" />
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photo-item">
              <div className="photo-details">
                <img src="./bg.jpg" alt="Image" />
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photo-item">
              <div className="photo-details">
                <img src="./bg.jpg" alt="Image" />
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photo-item">
              <div className="photo-details">
                <img src="./bg.jpg" alt="Image" />
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="Arrow Up Icon" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "Unblock User"
            : "Block User!"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Log Out
        </button>
      </div>
      <div className="author">
        <h4>Created By:</h4>
        <h3 className="author-name">Abdullah A.A</h3>
      </div>
    </div>
  );
};
export default Detail;
