import { useRef, useEffect } from "react";
import QRCode from "qrcode";

const UserQRui = ({ uuid }: { uuid?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (uuid) {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, uuid, function () {});
      }
    }
  }, [uuid]);

  return (
    <div className="flex justify-center mb-4">
      <div className="max-w-[240px] border border-line bg-surface rounded-card p-4 mb-5 relavive">
        <div className="max-w-[260px] mx-auto mb-3">
          <canvas
            className="bg-white block mx-auto w-full h-full border border-line"
            ref={canvasRef}
            width="260"
            height="260"
          />
        </div>
        <p className="text-center text-balance text-sm font-bold text-gray-600">
          Presentate con este QR en el evento central en CABA, para que podamos
          identificarte.
        </p>
      </div>
    </div>
  );
};

export default UserQRui;
