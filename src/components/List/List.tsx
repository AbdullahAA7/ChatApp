import ChatList from "./chatList/ChatList";
import "./List.css";
import UserInfo from "./userInfo/UserInfo";

const List = () => {
  return (
    <div className="List">
      <UserInfo />
      <ChatList />
    </div>
  );
};
export default List;
