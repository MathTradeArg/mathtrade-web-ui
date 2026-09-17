"use client";
import { useContext, useEffect } from "react";
import { PageContext } from "@/context/page";

const iconBottom = () =>
  window.matchMedia("(min-width: 1024px)").matches
    ? "30px"
    : // Tab bar (~3.5rem) plus the wants/list footer that sits above it.
      "calc(7.25rem + env(safe-area-inset-bottom, 0px))";

const ChatBoxButton = () => {
  const { userId } = useContext(PageContext);

  useEffect(() => {
    const dfMessenger = document.querySelector("df-messenger");
    if (!dfMessenger) {
      return undefined;
    }

    const applyBottom = () => {
      const icon = dfMessenger.shadowRoot?.querySelector("#widgetIcon");
      if (icon) {
        icon.style.bottom = iconBottom();
        icon.style.zIndex = "45";
      }
    };

    dfMessenger.addEventListener("df-messenger-loaded", applyBottom);
    applyBottom();
    window.addEventListener("resize", applyBottom);

    return () => {
      dfMessenger.removeEventListener("df-messenger-loaded", applyBottom);
      window.removeEventListener("resize", applyBottom);
    };
  }, []);

  return (
    <div className="relative z-40">
      <df-messenger
        chat-icon="https:&#x2F;&#x2F;www.mathtrade.com.ar&#x2F;chatbox.png"
        intent="WELCOME"
        chat-title="Ayuda Math Trade"
        agent-id="a642ce57-93e6-4849-8060-8295894f2a98"
        language-code="es"
        user-id={userId}
        session-id="1"
        wait-open
      ></df-messenger>
    </div>
  );
};

export default ChatBoxButton;
