import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useChatSotre } from "../../Lib/chatStore";
import { toast } from "react-toastify";
import { useUserSotre } from "../../Lib/userStore";
import Upload from "../../Lib/upload";
import timeAgo from "../../Lib/timeAgo";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currUser } = useUserSotre();
  const { chatId, user, isCurrUserBlocked, isReceiverBlocked } = useChatSotre();

  const endRef = useRef(null);

  useEffect(() => {
    //@ts-ignore
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  //@ts-ignore
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e: any) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;
    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await Upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currUser.id,
          text,
          createAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });
      const userIDs = [currUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userChats", id);
        const userChatRefSnapshot = await getDoc(userChatRef);

        if (userChatRefSnapshot.exists()) {
          const userChatsData = userChatRefSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setImg({
      file: null,
      url: "",
    });
    setText("");
  };
  return (
    <div className="Chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./blocked.png"} alt="Avatar Of user" />
          <div className="texts">
            <span>{user?.name}</span>
            <p>
              You had Start conversation {timeAgo(chat?.createdAt.toDate())}
            </p>
          </div>
        </div>
        <div className="icon">
          <img src="./phone.png" alt="Phone Icon" />
          <img src="./video.png" alt="Video Icon" />
          <img src="./info.png" alt="Information Icon" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currUser?.id ? "message own" : "message user"
            }
            key={message?.createAt}
            style={{ maxWidth: `${message.text.length * 15}px` }}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="Avatar" />}
              <p>{message.text}</p>
              <span>{timeAgo(message?.createAt.toDate())}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icon">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleImg}
            id="file"
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrUserBlocked || isReceiverBlocked
              ? "You cannot send message...😔"
              : "Send a message...😇"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt="Emoji Icon"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isCurrUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
