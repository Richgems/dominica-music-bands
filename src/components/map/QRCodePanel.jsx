import React, { useEffect, useRef, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Check, QrCode } from "lucide-react";

// Simple QR code using a free public API (no npm needed)
export default function QRCodePanel({ url }) {
  const [copied, setCopied] = useState(false);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DialogContent className="max-w-sm text-center">
      <DialogHeader>
        <DialogTitle className="font-heading flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Share This Map
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center gap-4 py-2">
        {/* QR Code */}
        <div className="p-3 rounded-xl border border-border bg-white shadow-sm">
          <img src={qrSrc} alt="QR Code" width={200} height={200} className="rounded" />
        </div>

        <p className="text-xs text-muted-foreground">
          Scan to open the interactive map on any device
        </p>

        {/* URL display + copy */}
        <div className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
          <span className="text-xs text-muted-foreground flex-1 truncate">{url}</span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-background transition-colors"
            title="Copy link"
          >
            {copied
              ? <Check className="w-4 h-4 text-green-600" />
              : <Copy className="w-4 h-4 text-muted-foreground" />
            }
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          This is a <strong>view-only</strong> public map. To suggest changes or contribute data, use the Contact page.
        </p>
      </div>
    </DialogContent>
  );
}