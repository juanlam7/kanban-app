"use client";

import { Board } from "@/lib/types";
import {
  getActiveBoardIndex,
  getCurrentBoardName,
  openAddAndEditBoardModal,
  setActiveBoardIndex,
  setCurrentBoardName,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import iconShowSidebar from "../../../public/icon-show-sidebar.svg";
import { Button } from "../button";
import SidebarFooter from "./Footer";

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const { data } = useFetchDataFromDbQuery();
  const dispatch = useAppDispatch();
  const currentBoardName = useAppSelector(getCurrentBoardName);
  const currentBoardIndex = useAppSelector(getActiveBoardIndex);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setShowSidebar(event.matches);
    };

    handleMediaChange(mediaQuery);

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!data || !data[0]?.boards) return;

    const boards = data[0].boards;
    const activeBoardIndex = boards.findIndex(
      (board: { name: string }) => board.name === currentBoardName
    );

    const activeBoard =
      activeBoardIndex !== -1 ? boards[activeBoardIndex] : boards[0];
    dispatch(setCurrentBoardName(activeBoard?.name ?? ""));
    dispatch(
      setActiveBoardIndex(activeBoardIndex !== -1 ? activeBoardIndex : 0)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentBoardName]);

  const handleNav = (index: number, name: string) => {
    setActiveBoardIndex(index);
    dispatch(setCurrentBoardName(name));
  };

  return (
    <div className="relative">
      <aside
        className={`${
          !showSidebar
            ? "w-0 overflow-hidden"
            : "w-[18.75rem] flex-none h-full py-6 pr-6"
        }
        transition-width duration-150 ease-out relative`}
      >
        {data && (
          <>
            <p className="pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
              {`All Boards (${data[0]?.boards.length ?? 0})`}
            </p>
            {data[0]?.boards.map((board: Board, index: number) => {
              const { name, id } = board;
              const isActive = index === currentBoardIndex;
              return (
                <div
                  key={id}
                  onClick={() => handleNav(index, name)}
                  className={`${
                    isActive
                      ? "bg-primary text-accent"
                      : "transition ease-in duration-150 delay-150 hover:bg-accent dark:hover:bg-accent"
                  } cursor-pointer rounded-tr-full rounded-br-full flex items-center space-x-2 pl-[2.12rem] py-3 pb-3`}
                >
                  <p className="text-lg capitalize">{name}</p>
                </div>
              );
            })}
          </>
        )}
        <Button
          onClick={() => dispatch(openAddAndEditBoardModal("Add New Board"))}
          variant="ghost"
          className="flex items-center space-x-2 pl-[2.12rem] py-3"
        >
          <p className="text-base font-bold capitalize text-primary">
            + Create New Board
          </p>
        </Button>
        <SidebarFooter
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </aside>
      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className={`${
          !showSidebar ? "block" : "hidden"
        } cursor-pointer h-12 w-14 bg-primary transition ease-in 
        duration-150 delay-150 absolute left-full rounded-tr-full rounded-br-full 
            bottom-4 flex items-center justify-center`}
      >
        <Image
          src={iconShowSidebar}
          alt="show sidebar"
          className="object-contain"
        />
      </div>
    </div>
  );
}
