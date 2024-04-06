import Image from "next/image";
import Header from "@/app/_components/Header";
import Board from "./_components/Board";

export default function Home() {
  return (
    <main className="">
      <Header />
      <Board />
    </main>
  );
}
