"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  redirect("/btcPlus");
}
