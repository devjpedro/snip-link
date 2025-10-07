import { useState } from "react";
import { LONG_DELAY } from "@/app/constants/delay";

export const useCopyToClipboard = (baseUrl?: string) => {
  const [copied, setCopied] = useState(new Set<string>());

  const copy = async (text: string, id?: string) => {
    const fullUrl = `${baseUrl}/${text}`;
    await navigator.clipboard.writeText(baseUrl ? fullUrl : text);

    setCopied((prev) => new Set(prev).add(id ?? text));

    setTimeout(
      () =>
        setCopied((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id ?? text);
          return newSet;
        }),
      LONG_DELAY
    );
  };

  return { copied, copy };
};
