import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { toast } from "react-toastify";

export const useUserSotre = create((set) => ({
  currUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currUser: docSnap.data(), isLoading: false });
      } else {
        set({ currUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return set({ currUser: null, isLoading: false });
    }
  },
}));
