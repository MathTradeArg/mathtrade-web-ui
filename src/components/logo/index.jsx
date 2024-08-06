import LogoSVG from "./svg";

const mockMode = process.env.API_MOCK_MODE === "yes";

const Logo = () => {
  return (
    <div className="flex items-center justify-center mb-4 relative w-fit mx-auto">
      <div className="w-[70px] ">
        <LogoSVG />
      </div>
      <div className="pl-4">
        <div className="text-4xl text-logo leading-8">
          <span className="font-bold">Math</span>Trade
        </div>
        <div className="text-gray-400  text-lg leading-5">Argentina</div>
      </div>
      {mockMode ? (
        <div className="absolute bottom-0 right-0 bg-red-600 text-white text-xs font-bold px-2  rounded-lg">
          DEMO VERSION
        </div>
      ) : null}
    </div>
  );
};

export default Logo;
