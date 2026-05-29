"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrivateTopbar({
  title,
  onShare,
  sharing,
}: {
  title: string;
  onShare?: () => void;
  sharing?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs text-muted-foreground">Moneybug Dashboard</div>
        <div className="mt-1 text-balance text-2xl font-semibold tracking-tight">{title}</div>
      </div>
      <div className="flex items-center gap-2">
        {onShare ? (
          <Button
            className="gap-2"
            variant="secondary"
            onClick={onShare}
            disabled={sharing}
          >
            <Share2 className="h-4 w-4" />
            Share My Positions
          </Button>
        ) : null}
      </div>
    </div>
  );
}
