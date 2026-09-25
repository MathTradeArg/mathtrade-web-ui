"use client";
import { useContext, useEffect } from "react";
import { PageContext } from "@/context/page";

// Shown on desktop only (see the wrapper below): on phones the floating
// icon covered content and was in the way.
const ICON_SIZE = "44px";

const ChatBoxButton = () => {
  const { userId } = useContext(PageContext);

  useEffect(() => {
    const dfMessenger = document.querySelector("df-messenger");
    if (!dfMessenger) {
      return undefined;
    }

    const applyIconStyle = () => {
      const icon = dfMessenger.shadowRoot?.querySelector("#widgetIcon");
      if (icon) {
        icon.style.bottom = "20px";
        icon.style.right = "20px";
        icon.style.width = ICON_SIZE;
        icon.style.height = ICON_SIZE;
        icon.style.zIndex = "45";
        icon.querySelectorAll("img, svg").forEach((el) => {
          el.style.maxWidth = "100%";
          el.style.maxHeight = "100%";
        });
      }
    };

    dfMessenger.addEventListener("df-messenger-loaded", applyIconStyle);
    applyIconStyle();

    return () => {
      dfMessenger.removeEventListener("df-messenger-loaded", applyIconStyle);
    };
  }, []);

  return (
    <div className="relative z-40 hidden lg:block">
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
