"use client";
import { useContext } from "react";
import { PageContext } from "@/context/page";
import Link from "next/link";
import LogoSVG from "../logo/svg";
import CartButton from "./cart";
import AccountMenuButton from "./account";
import NotificationsButton from "./notifications";
import MainMenu from "./menu";
import { PRIVATE_ROUTES } from "@/config/routes";
import clsx from "clsx";
import TimelineButton from "./timeline";
import HelpButton from "./helpButton";
import AdvCompromise from "./advCompromise";
import Wrapper from "../wrapper";
import I18N from "@/i18n";

const Header = () => {
  /* PAGE CONTEXT **********************************************/
  const { mathtrade, membership, pageType, canI } = useContext(PageContext);
  /* end PAGE CONTEXT */

  return (
    <>
      <nav
        className={clsx("z-[9999] w-full left-0 top-0", {
          fixed: pageType !== "wants-grid",
          absolute: pageType === "wants-grid",
        })}
      >
        <Wrapper>
          <nav className="h-11 bg-black rounded-b-main shadow-main pl-2 pr-3">
            <div className="flex items-center justify-between h-11">
              <div className="flex items-center">
                <Link
                  href={PRIVATE_ROUTES.HOME.path}
                  className="block h-11 w-11 p-1"
                >
                  <LogoSVG />
                </Link>
                <div className="main-header_col">
                  <MainMenu />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {mathtrade && Object.keys(mathtrade).length > 0 ? (
                  <div className="main-header_col">
                    <TimelineButton />
                  </div>
                ) : null}
                <div className="main-header_col">
                  <NotificationsButton />
                </div>
                {mathtrade &&
                Object.keys(mathtrade).length > 0 &&
                membership &&
                canI.want ? (
                  <div className="main-header_col">
                    <CartButton />
                  </div>
                ) : null}

                <div className="main-header_col">
                  <HelpButton />
                </div>
                <AccountMenuButton />
              </div>
            </div>
          </nav>
        </Wrapper>
      </nav>
      {!canI.offer && canI.commit ? <AdvCompromise /> : null}
    </>
  );
};

export default Header;
