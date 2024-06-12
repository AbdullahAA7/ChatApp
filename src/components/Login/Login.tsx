import { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../Lib/firebase.ts";
import { doc, setDoc } from "firebase/firestore";
import Upload from "../../Lib/upload.ts";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e: any) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { name, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await Upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });
      toast.success("You have signed up!You can login now");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="Login">
      <div className="item">
        <h2>Welcome back to StarChat , Login here</h2>
        <form action="#" onSubmit={handleLogin}>
          <input type="email" placeholder="Enter email..." name="email" />
          <input
            type="password"
            placeholder="Enter password..."
            name="password"
          />
          <button disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>
      </div>
      <div className="line"></div>
      <div className="item">
        <h2>Welcome to StarChat , Signup here</h2>
        <form onSubmit={handleSignup}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" /> Upload Image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Enter username..." name="name" />
          <input type="email" placeholder="Enter email..." name="email" />
          <input
            type="password"
            placeholder="Enter password..."
            name="password"
          />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
