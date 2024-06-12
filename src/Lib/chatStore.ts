import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserSotre } from "./userStore";

export const useChatSotre = create((set) => ({
  chatId: null,
  user: null,
  isCurrUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId: any, user: any) => {
    const currUser = useUserSotre.getState().currUser;

    if (user.blocked.includes(currUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      set({
        chatId,
        user: user,
        isCurrUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state: any) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));
