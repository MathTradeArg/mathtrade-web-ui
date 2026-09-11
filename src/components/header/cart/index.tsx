"use client";
import { useCallback, useState, useContext, useRef, useEffect } from "react";
import { PageContext } from "@/context/page";
import HeadContent from "../head-content";
import HeadButton from "../head-button";
import Icon from "@/components/icon";
import I18N from "@/i18n";
import CartList from "./list";

type CartButtonProps = {
  // "row" renders an icon + label row, for the sidebar's utility row.
  variant?: "header" | "row";
  placement?: "below" | "right";
};

const CartButton = ({
  variant = "header",
  placement = "below",
}: CartButtonProps = {}) => {
  /* PAGE CONTEXT **********************************************/
  const { newMyWantsNum, wantsNumPosition, setWantsNumPosition } =
    useContext(PageContext);
  /* end PAGE CONTEXT */

  const [visibleMobile, setVisibleMobile] = useState(false);

  const toggleMobile = useCallback(() => {
    setVisibleMobile((v) => !v);
  }, []);

  /*************************/
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonRefPosition, setButtonRefPosition] = useState({
    xPos: 0,
    yPos: 0,
  });
  const [showFloatNum, setShowFloatNum] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (wantsNumPosition) {
      const { x, y, width, height } = buttonRef.current.getBoundingClientRect();

      const xPos = Math.round(x + 0.5 * width - 8);
      const yPos = Math.round(y + 0.5 * height - 8);

      setButtonRefPosition({ xPos, yPos });
      setShowFloatNum(true);

      timer = setTimeout(() => {
        setShowFloatNum(false);
        setWantsNumPosition(null);
      }, 600);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [wantsNumPosition, setWantsNumPosition]);
  /*************************/

  return (
    <>
      <div className="relative">
        {variant === "row" ? (
          <button
            className="flex items-center gap-3 w-full text-left cursor-pointer peer text-sm text-white/80 hover:text-white px-2 py-2 rounded-lg hover:bg-white/5"
            onClick={toggleMobile}
            ref={buttonRef}
          >
            <span className="relative text-lg">
              <Icon type="heart" />
              {newMyWantsNum ? (
                <span className="absolute -top-1 -right-1.5 bg-want text-white text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
                  {newMyWantsNum}
                </span>
              ) : null}
            </span>
            <I18N id="menu.wants" />
          </button>
        ) : (
          <HeadButton
            onClick={toggleMobile}
            icon="heart"
            num={newMyWantsNum}
            forWants
            buttonRef={buttonRef}
          />
        )}
        <HeadContent
          visibleMobile={visibleMobile}
          toggleMobile={toggleMobile}
          placement={placement}
        >
          <CartList toggleMobile={toggleMobile} />
        </HeadContent>
      </div>

      {showFloatNum ? (
        <>
          <div className="fixed z-[24000] bg-want text-white font-bold text-center text-[9px] leading-[16px] h-[16px] w-[16px] rounded-full num-float-cart">
            1
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
        .num-float-cart{
          animation: num-float-cart-travel 0.6s both ease-out;
        }
        @keyframes num-float-cart-travel {
          0% {
            top: ${wantsNumPosition?.yPos || 0}px;
            left: ${wantsNumPosition?.xPos || 0}px;
            transform: scale(2);
          }
          100% {
            top: ${buttonRefPosition.yPos}px;
            left: ${buttonRefPosition.xPos}px;
            transform: scale(1);
          }
        }

        `,
            }}
          />
        </>
      ) : null}
    </>
  );
};
export default CartButton;
