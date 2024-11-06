import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  currentBoardName: "",

  activeBoardIndex: 0,
  isAddAndEditBoardModal: { isOpen: false, variant: "" },
  isAddAndEditTaskModal: {
    isOpen: false,
    variant: "",
    title: "",
    index: -1,
    name: "",
  },
  isDeleteBoardAndTaskModal: {
    isOpen: false,
    variant: "",
    title: "",
    status: "",
    index: -1,
  },
};

export const features = createSlice({
  name: "features",
  initialState,

  reducers: {
    setCurrentBoardName: (state, action: PayloadAction<string>) => {
      state.currentBoardName = action.payload;
    },

    setActiveBoardIndex: (state, { payload }) => {
      state.activeBoardIndex = payload;
    },
    openAddAndEditBoardModal: (state, { payload }) => {
      state.isAddAndEditBoardModal.isOpen = true;
      state.isAddAndEditBoardModal.variant = payload;
    },
    closeAddAndEditBoardModal: (state) => {
      state.isAddAndEditBoardModal.isOpen = false;
      state.isAddAndEditBoardModal.variant = "";
    },
    openAddAndEditTaskModal: (state, { payload }) => {
      state.isAddAndEditTaskModal.isOpen = true;
      state.isAddAndEditTaskModal.variant = payload.variant;
      state.isAddAndEditTaskModal.title = payload.title;
      state.isAddAndEditTaskModal.index = payload.index;
      state.isAddAndEditTaskModal.name = payload.name;
    },
    closeAddAndEditTaskModal: (state) => {
      state.isAddAndEditTaskModal.isOpen = false;
      state.isAddAndEditTaskModal.variant = "";
      state.isAddAndEditTaskModal.title = "";
      state.isAddAndEditTaskModal.index = -1;
      state.isAddAndEditTaskModal.name = "";
    },
    openDeleteBoardAndTaskModal: (state, { payload }) => {
      state.isDeleteBoardAndTaskModal.isOpen = true;
      state.isDeleteBoardAndTaskModal.variant = payload.variant;
      state.isDeleteBoardAndTaskModal.title = payload.title;
      state.isDeleteBoardAndTaskModal.status = payload.status;
      state.isDeleteBoardAndTaskModal.index = payload.index;
    },
    closeDeleteBoardAndTaskModal: (state) => {
      state.isDeleteBoardAndTaskModal.isOpen = false;
      state.isDeleteBoardAndTaskModal.variant = "";
      state.isDeleteBoardAndTaskModal.title = "";
      state.isDeleteBoardAndTaskModal.status = "";
      state.isDeleteBoardAndTaskModal.index = -1;
    },
  },
});

export const {
  setCurrentBoardName,
  openAddAndEditBoardModal,
  closeAddAndEditBoardModal,
  openAddAndEditTaskModal,
  closeAddAndEditTaskModal,
  openDeleteBoardAndTaskModal,
  closeDeleteBoardAndTaskModal,
  setActiveBoardIndex,
} = features.actions;

export const getDeleteBoardAndTaskModalValue = (state: RootState) =>
  state.features.isDeleteBoardAndTaskModal.isOpen;

export const getDeleteBoardAndTaskModalVariantValue = (state: RootState) =>
  state.features.isDeleteBoardAndTaskModal.variant;

export const getDeleteBoardAndTaskModalStatus = (state: RootState) =>
  state.features.isDeleteBoardAndTaskModal.status;

export const getDeleteBoardAndTaskModalIndex = (state: RootState) =>
  state.features.isDeleteBoardAndTaskModal.index;

export const getDeleteBoardAndTaskModalTitle = (state: RootState) =>
  state.features.isDeleteBoardAndTaskModal.title;

export const getAddAndEditTaskModalValue = (state: RootState) =>
  state.features.isAddAndEditTaskModal.isOpen;

export const getAddAndEditTaskModalVariantValue = (state: RootState) =>
  state.features.isAddAndEditTaskModal.variant;

export const getAddAndEditTaskModalTitle = (state: RootState) =>
  state.features.isAddAndEditTaskModal.title;

export const getAddAndEditTaskModalIndex = (state: RootState) =>
  state.features.isAddAndEditTaskModal.index;

export const getAddAndEditTaskModalName = (state: RootState) =>
  state.features.isAddAndEditTaskModal.name;

export const getActiveBoardIndex = (state: RootState) =>
  state.features.activeBoardIndex;

export const getCurrentBoardName = (state: RootState) =>
  state.features.currentBoardName;
export const getAddAndEditBoardModalValue = (state: RootState) =>
  state.features.isAddAndEditBoardModal.isOpen;
export const getAddAndEditBoardModalVariantValue = (state: RootState) =>
  state.features.isAddAndEditBoardModal.variant;
export default features.reducer;
