import Link from "next/link";

import { Card } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useStore } from "@/states";

const Notice = () => {
  const { setNoticeOpen } = useStore();
  return (
    <Card className="!p-0 !bg-primaryColor mt-[10px]">
      <div className="text-base font-MatterSQ-Regular text-[#202020] px-6 py-2 bg-contain bg-no-repeat bg-left bg-[url('/btc+-bg-h5.png')] flex flex-col items-end">
        <div className="w-[63%]">
          <div>Grow Your Bitcoin at Ease. Earn 5% APY with BTC+!</div>
          <Link
            href="/btcPlus"
            className="text-mainColor underline decoration-1 underline-offset-2"
          >
            View Detail
          </Link>
        </div>
        <Cross1Icon
          className="w-3 h-3 absolute top-3 right-3"
          onClick={() => {
            setNoticeOpen(false);
          }}
        />
      </div>
    </Card>
  );
};

export default Notice;
