import { useRef, useEffect } from "react";
import QRCode from "qrcode";

const UserQRui = ({ uuid }: { uuid?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (uuid) {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, uuid, { width: 400, margin: 2 }, function () {});
      }
    }
  }, [uuid]);

  return (
    <div className="flex justify-center mb-4">
      <div className="w-full max-w-[400px] border border-line bg-surface rounded-card p-4 mb-5 relative">
        <div className="mx-auto mb-3">
          <canvas
            className="bg-white block mx-auto w-full h-full border border-line"
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
