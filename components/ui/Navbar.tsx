"use client";

import { TaskModalVariantEnum } from "@/lib/enums";
import {
  getCurrentBoardName,
  openAddAndEditTaskModal,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "./button";
import Dropdown from "./Dropdown";

export default function Navbar() {
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const currentBoardName = useAppSelector(getCurrentBoardName);

  return (
    <nav className="border flex h-24">
      <div className="md:flex hidden flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
        <p className="font-bold text-3xl"> Kanban App </p>
      </div>

      <div className="flex justify-between w-full items-center pr-[2.12rem]">
        <p className="text-2xl font-bold pl-6">
          {currentBoardName.length > 0
            ? currentBoardName
            : t('create_first_board')}
        </p>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() =>
              dispatch(
                openAddAndEditTaskModal({
                  variant: TaskModalVariantEnum.AddNewTask,
                })
              )
            }
            className="px-4 py-2 flex items-center"
          >
            <p>+ {t("add_new_task")}</p>
          </Button>
          <div className="relative flex items-center">
            <Button
              variant="ghost"
              className="text-3xl rotate-90 pb-4"
              onClick={() => setShow(!show)}
            >
              ⦀
            </Button>
            <Dropdown setShow={setShow} show={show} />
          </div>
        </div>
      </div>
    </nav>
  );
}
