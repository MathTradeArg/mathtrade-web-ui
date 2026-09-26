"use client";
import Image from "next/image";
import posterSrc from "@/img/video-poster.jpg";
import { linksToHelp } from "@/config/linksToHelp";
import I18N from "@/i18n";

// The tutorial, promoted: a big card that opens YouTube in a new tab (no
// embed, so nothing from YouTube loads until someone clicks).
const VideoCta = () => (
  <a
    href={linksToHelp.video}
    target="_blank"
    rel="noopener noreferrer"
    className="group block rounded-xl overflow-hidden shadow-lg bg-gray-900 text-white"
  >
    <div className="relative aspect-video">
      <Image
        src={posterSrc}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover opacity-70 group-hover:opacity-60 transition-opacity"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-20 h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition-transform group-hover:scale-110">
          <svg
            viewBox="0 0 24 24"
            className="w-9 h-9 ml-1 fill-primary"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg leading-tight">
        <I18N id="videoCta.title" />
      </h3>
      <p className="text-sm text-white/80 mt-1">
        <I18N id="videoCta.text" />
      </p>
      <span className="inline-block mt-3 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold group-hover:opacity-90">
        <I18N id="videoCta.button" /> ↗
      </span>
    </div>
  </a>
);

export default VideoCta;
