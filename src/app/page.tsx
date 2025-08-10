"use client";

import { useEffect } from "react";

import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function Home({ children }: { children: React.ReactNode }) {
  const { setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return <div className="my-3 max-w-[1200px] md:mx-auto">{children}</div>;
}
