"use client";

import { Button } from "@snip-link/ui/components/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const RedirectToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight || 0;
      if (window.scrollY > heroHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size="icon"
        // variant="ghost"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
};
