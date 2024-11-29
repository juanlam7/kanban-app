import { BoardModalVariantEnum, DeleteModalVariantEnum } from "@/lib/enums";
import {
  openAddAndEditBoardModal,
  openDeleteBoardAndTaskModal,
} from "@/redux/features/appSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "./button";

interface IDropdown {
  show: boolean;
  setShow: (value: boolean) => void;
}

export default function Dropdown({ show, setShow }: IDropdown) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    },
    [setShow]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const openEditBoard = useCallback(() => {
    dispatch(openAddAndEditBoardModal(BoardModalVariantEnum.EditBoard));
  }, [dispatch]);

  const openDeleteBoard = useCallback(() => {
    dispatch(
      openDeleteBoardAndTaskModal({
        variant: DeleteModalVariantEnum.DeleteBoard,
      })
    );
  }, [dispatch]);

  if (!show) return null;

  return (
    <div
      ref={dropdownRef}
      className="w-48 absolute top-full bg-secondary shadow-lg right-0 py-2 rounded-2xl z-10"
    >
      <DropdownItem onClick={openEditBoard}>{t("edit_board")}</DropdownItem>
      <DropdownItem onClick={openDeleteBoard}>{t("delete_board")}</DropdownItem>
    </div>
  );
}

function DropdownItem({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button variant="link" className="text-sm px-4 py-2" onClick={onClick}>
      {children}
    </Button>
  );
}
