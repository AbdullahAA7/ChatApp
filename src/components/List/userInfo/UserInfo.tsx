import { useUserSotre } from "../../../Lib/userStore";
import "./UserInfo.css";

const UserInfo = () => {
  const { currUser } = useUserSotre();
  return (
    <div className="UserInfo">
      <div className="user">
        <img src={currUser.avatar || "./avatar.png"} alt="User Image" />
        <h2>{currUser.name}</h2>
      </div>
      <div className="icon">
        <img src="./more.png" alt="More" />
        <img src="./video.png" alt="Video Call" />
        <img src="./edit.png" alt="edit" />
      </div>
    </div>
  );
};
export default UserInfo;
