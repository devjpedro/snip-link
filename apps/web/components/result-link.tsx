import { Button } from "@snip-link/ui/components/button";
import { Check, Copy } from "lucide-react";

export const ResultLink = ({
  shortUrl,
  copied,
  handleCopy,
}: {
  shortUrl: string;
  copied: boolean;
  handleCopy: () => void;
}) => {
  return (
    <div className="flex animate-fade-in-up items-center gap-2 rounded-lg border bg-muted/50 p-3">
      <div className="flex-1 font-mono text-sm">
        <a
          className="hover:underline"
          href={shortUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {shortUrl}
        </a>
      </div>
      <Button
        className="shrink-0"
        onClick={handleCopy}
        size="sm"
        variant="ghost"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
