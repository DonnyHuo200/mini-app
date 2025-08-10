"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const useScrollToHash = () => {
  const pathname = usePathname();

  const [hash, setHash] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    setHash(hash);
    if (hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [pathname]);

  return { hash };
};

export default useScrollToHash;
