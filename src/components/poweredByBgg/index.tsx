import Image from "next/image";
import clsx from "clsx";
import { getI18Ntext } from "@/i18n";

const BGG_HOME_URL = "https://boardgamegeek.com";

const PoweredByBGG = ({ className = "" }) => {
  const label = getI18Ntext("footer.poweredByBGG");

  return (
    <a
      href={BGG_HOME_URL}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={clsx(
        "inline-flex items-center shrink-0 hover:opacity-80 transition-opacity",
        className
      )}
    >
      <Image
        src="/img/powered-by-bgg.png"
        alt={label}
        width={200}
        height={59}
        className="h-8 sm:h-10 w-auto"
      />
    </a>
  );
};

export default PoweredByBGG;
