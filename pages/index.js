import Head from "next/head";

import { NavTitle } from "../components/Typography";
import LogicCard from "../components/LogicCard";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose"></script>
      </Head>
      <HomeContent />
    </div>
  );
}

const HomeContent = () => {
  return (
    <div className="w-full h-full flex flex-col text-black bg-white">
      <Navbar />
      <div className="h-full p-8 flex-wrap">
        <LogicCard title="Office Space 1" brightness={0.3} id={0} />
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="w-full h-12 flex items-center bg-white p-8 border-b-2 border-gray-200">
      <NavTitle className="relative float-left ml-0">[LOGO] Spaces.</NavTitle>
      <div className="relative float-right mr-0 ml-auto">
        Your World On The Cloud
      </div>
    </div>
  );
};
