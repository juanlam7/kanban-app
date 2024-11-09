import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { AllBoards, Board, QueryAllBoards } from "@/lib/types";

// TODO: Move firebase request to a repository folder where all endpoint calls will be handled no matter if there are API Rest or Firebase request

export const fireStoreApi = createApi({
  reducerPath: "firestoreApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    fetchDataFromDb: builder.query<QueryAllBoards, void>({
      async queryFn() {
        try {
          const session = await getSession();
          if (session?.user) {
            const { user } = session;

            const ref = collection(db, `users/${user.email}/tasks`);
            const querySnapshot = await getDocs(ref);

            const data: AllBoards[] = querySnapshot.docs.map((doc) => {
              const docData = doc.data();
              return {
                boards: docData.boards,
              };
            });

            return { data };
          }
          return { data: [] };
        } catch (e) {
          return { error: e };
        }
      },
      providesTags: ["Tasks"],
    }),
    updateBoardToDb: builder.mutation({
      async queryFn(boardData: Board[]) {
        try {
          const session = await getSession();
          if (session?.user) {
            const { user } = session;

            const ref = collection(db, `users/${user.email}/tasks`);
            const querySnapshot = await getDocs(ref);

            const boardId = querySnapshot.docs.map((doc) => {
              return doc.id;
            });
            await updateDoc(doc(db, `users/${user.email}/tasks/${boardId}`), {
              boards: boardData,
            });
          }
          return { data: null };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } = fireStoreApi;
