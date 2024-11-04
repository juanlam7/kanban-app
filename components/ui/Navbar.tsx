"use client";

import { Button } from "./button";
import Dropdown from "./Dropdown";
import { useState } from "react";

export default function Navbar() {
  const [show, setShow] = useState<boolean>(false);

  return (
    <nav className="bg-white border flex h-24">
      <div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
        <p className="font-bold text-3xl"> Kanban App </p>
      </div>

      <div className="flex justify-between w-full items-center pr-[2.12rem]">
        <p className="text-black text-2xl font-bold pl-6">Current board name</p>

        <div className="flex items-center space-x-3">
          <Button className="px-4 py-2 flex items-center">
            <p>+ Add New Task</p>
          </Button>
          <div className="relative flex items-center">
            <Button
              variant="ghost"
              className="text-3xl rotate-90 pb-4"
              onClick={() => setShow(!show)}
            >
              ⦀
            </Button>
            <Dropdown show={show} />{" "}
            {/* render dropdown here and pass show as prop */}
          </div>
        </div>
      </div>
    </nav>
  );
}
