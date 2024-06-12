import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
const Notify = () => {
  return (
    <div className="Notify">
      <ToastContainer
        position="bottom-right"
        style={{ position: "absolute" }}
      />
    </div>
  );
};

export default Notify;
