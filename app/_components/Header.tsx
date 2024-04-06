"use client";
import { useBoardStore } from "@/store/BoardStore";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Avatar from "react-avatar";
function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  

  return (
    <header className="">
      {/* Gradient Background */}

      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute -z-20 top-0 left-0 w-full h-[16rem] bg-gradient-to-br from-pink-400 to-[#0055D1] filter rounded-md blur-3xl opacity-40" />

        <Image
          src="/trello-logo.svg"
          alt="trello Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full ">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1  outline-none p-2 "
            />
            <button hidden type="submit"></button>
          </form>
          <Avatar name="Hurr Ali" size="50" color="#0055D1" round />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm font-light shadow-xl pr-5 rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1] p-5 ">
          <UserCircleIcon className="inline-block h-10 w-10 text-[#0055D1] mr-1 " />
          GPT is Summarizing Your Task For The Day ....
        </p>
      </div>
    </header>
  );
}

export default Header;
