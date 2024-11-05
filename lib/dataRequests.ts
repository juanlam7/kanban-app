import { addDoc, collection, getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { db } from "./firebaseConfig";
import { data } from "./utils";

// TODO: Move firebase request to a repository folder where all endpoint calls will be handled no matter if there are API Rest or Firebase request

export const createInitialData = async () => {
  const session = await getServerSession();
  if (session && session.user && session.user.email) {
    const docRef = collection(db, "users", session.user.email, "tasks");
    const getDos = await getDocs(docRef);

    if (getDos.docs.length > 0) {
      return;
    } else {
      try {
        await addDoc(
          collection(db, "users", session.user.email, "tasks"),
          data
        );
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
};
