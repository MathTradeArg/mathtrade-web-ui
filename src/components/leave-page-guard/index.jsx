"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/confirmModal";

const GUARD = "__leaveGuard";
// Mounted back-button guards; lets a quick unmount/remount (React strict
// mode, re-renders) keep the extra history entry instead of dropping it.
let activeGuards = 0;

// Asks before leaving a page with unsaved changes:
// - in-app links and the browser's back button: our own modal;
// - refresh, closing the tab or typing a URL: the browser's own dialog
//   (browsers don't let a page replace it with a custom one).
// The App Router has no route-change-cancel API, so links are caught with a
// capture-phase click listener (before Next's <Link> handler) and "back" with
// an extra history entry for this same page.
const LeavePageGuard = ({ when }) => {
  const router = useRouter();
  const [pending, setPending] = useState(null); // { href } | { back: true }
  const whenRef = useRef(when);
  whenRef.current = when;
  const leavingRef = useRef(false);

  // Refresh / close / typed URL.
  useEffect(() => {
    if (!when) return undefined;
    const onBeforeUnload = (e) => {
      if (leavingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when]);

  // In-app links to another page.
  useEffect(() => {
    if (!when) return undefined;
    const onClick = (e) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = e.target?.closest?.("a[href]");
      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href, window.location.href);
      // Other sites go through beforeunload; same page (tabs, anchors) is fine.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      setPending({ href: `${url.pathname}${url.search}${url.hash}` });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [when]);

  // Browser back button.
  useEffect(() => {
    if (!when) return undefined;
    const pushGuard = () =>
      window.history.pushState(
        { ...window.history.state, [GUARD]: true },
        "",
        window.location.href
      );
    activeGuards += 1;
    if (!window.history.state?.[GUARD]) pushGuard();

    const onPopState = () => {
      if (leavingRef.current || !whenRef.current) return;
      // "Back" just left the extra entry: stay here and ask.
      pushGuard();
      setPending({ back: true });
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      activeGuards -= 1;
      // Changes saved: drop the extra entry so "back" works in one press.
      setTimeout(() => {
        if (
          activeGuards === 0 &&
          !leavingRef.current &&
          window.history.state?.[GUARD]
        ) {
          window.history.back();
        }
      }, 0);
    };
  }, [when]);

  const onCancel = useCallback(() => setPending(null), []);

  const onConfirm = useCallback(() => {
    const target = pending;
    setPending(null);
    leavingRef.current = true;
    if (target?.href) {
      router.push(target.href);
    } else if (target?.back) {
      // Skip the extra entry and the page itself.
      window.history.go(-2);
    }
  }, [pending, router]);

  return (
    <ConfirmModal
      isOpen={!!pending}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title="leaveGuard.title"
      description="leaveGuard.text"
      cancelId="leaveGuard.stay"
      confirmId="leaveGuard.leave"
    />
  );
};

export default LeavePageGuard;
