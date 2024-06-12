import { useEffect, useState } from "react";
import "./ChatList.css";
import AddUser from "./AddUser/AddUser";
import { useUserSotre } from "../../../Lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../Lib/firebase";
import { useChatSotre } from "../../../Lib/chatStore";
import { toast } from "react-toastify";
const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currUser } = useUserSotre();
  const { changeChat } = useChatSotre();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userChats", currUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item: any) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user };
      });
      const chatData = await Promise.all(promises);
      //@ts-ignore
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });
    return () => {
      unSub();
    };
  }, [currUser.id]);

  const handleSelect = async (chat: any) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userChats", currUser.id);

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const filteredChats = chats.filter((c) =>
    c.user.name.toLowerCase().includes(input.toLowerCase())
  );
  return (
    <div className="ChatList">
      <div className="search">
        <div className="search-bar">
          <img src="./search.png" alt="Search" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Add User "
          className="add-icon"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      <div className="items">
        {filteredChats.map((chat: any) => (
          <div
            className="item-list"
            style={{
              background: chat?.isSeen ? "transparent" : "rgb(0, 92, 75)",
            }}
          >
            <div
              className="item"
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
            >
              <img
                src={
                  chat.user.blocked.includes(currUser.id)
                    ? "./blocked.png"
                    : chat.user.avatar || "./avatar.png"
                }
                alt="Avatar"
              />
              <div className="texts">
                <span style={{ fontWeight: "500", letterSpacing: "1px" }}>
                  {chat.user.blocked.includes(currUser.id)
                    ? "Unknown"
                    : chat.user.name}
                </span>
                <p style={{ opacity: "0.6" }}>{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {addMode && <AddUser />}
    </div>
  );
};
export default ChatList;
