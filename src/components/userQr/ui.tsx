import { useRef, useEffect } from "react";
import QRCode from "qrcode";

const UserQRui = ({ uuid }: { uuid?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (uuid) {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        QRCode.toCanvas(canvas, uuid, { width: 400, margin: 2 }, function () {
          // qrcode writes a fixed px size into canvas.style; drop it so CSS scales the canvas.
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        });
      }
    }
  }, [uuid]);

  return (
    <div className="flex justify-center mb-4">
      <div className="w-full max-w-[400px] min-w-0 overflow-hidden border border-line bg-card shadow-card rounded-card p-4 mb-5 relative">
        <div className="mx-auto mb-3 w-full max-w-[320px] aspect-square">
          <canvas
            className="bg-white block mx-auto w-full h-auto max-w-full aspect-square border border-line"
            ref={canvasRef}
            width="400"
            height="400"
          />
        </div>
        <p className="text-center text-balance text-sm font-bold text-ink-muted">
          Presentate con este QR en el evento central en CABA, para que podamos
          identificarte.
        </p>
      </div>
    </div>
  );
};

export default UserQRui;
