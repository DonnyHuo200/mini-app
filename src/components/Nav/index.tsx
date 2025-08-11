import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";

import { useSolvBtcStore } from "@/states";

const navList = [
  {
    name: "BTC+",
    description:
      "A strategy-aggregated BTC fund optimizing risk-adjusted yield across DeFi.",
    href: "/",
    new: (
      <div className="absolute left-[40px] top-0 box-border flex h-[10px] w-[20px] items-center justify-center rounded-full bg-[#FD4040] text-[7px] capitalize text-white">
        New
      </div>
    )
  },
  {
    name: "SolvBTC",
    description:
      "A universal liquid Bitcoin backed 1:1 by BTC used across CeDeFi.",
    href: "/solvbtc"
  },
  {
    name: "Portfolio",
    description:
      "Track all your BTC-based assets, positions and strategies in one unified dashboard.",
    href: "/portfolio"
  }
];

const Nav = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { mode, setNavOpen } = useSolvBtcStore();

  const { address } = useAccount();

  const { connect, connectors } = useConnect();

  const handleNavClick = async (href: string) => {
    if (!address && href === "/portfolio") {
      await connect({
        connector: connectors[0]
      });
    }

    router.push(href);
    setTimeout(() => {
      setNavOpen(false);
    }, 300);
  };

  return (
    <div
      className={classNames(
        className,
        "fixed top-[50px] left-0 right-0 z-50 w-full h-full p-4",
        {
          "bg-black": mode === "dark",
          "bg-white": mode === "light"
        }
      )}
    >
      {navList.map((item) => (
        <div
          className="mb-4"
          key={item.name}
          onClick={() => handleNavClick(item.href)}
        >
          <div className="text-base font-MatterSQ-Medium relative">
            {item.name}
            {item.new ? item.new : null}
          </div>
          <div className="text-xs text-gray-500">{item.description}</div>
        </div>
      ))}
    </div>
  );
};

export default Nav;
