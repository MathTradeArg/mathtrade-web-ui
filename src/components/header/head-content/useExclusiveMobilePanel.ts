"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// On mobile, panels (help, calendar, notifications, account) open full
// screen: only one at a time. Opening one tells the others to close.
const listeners = new Set<(openedId: string) => void>();

const useExclusiveMobilePanel = (id: string) => {
  const [visibleMobile, setVisibleMobile] = useState(false);
  const visibleRef = useRef(false);
  visibleRef.current = visibleMobile;

  useEffect(() => {
    const onOtherOpened = (openedId: string) => {
      if (openedId !== id) setVisibleMobile(false);
    };
    listeners.add(onOtherOpened);
    return () => {
      listeners.delete(onOtherOpened);
    };
  }, [id]);

  const toggleMobile = useCallback(() => {
    const next = !visibleRef.current;
    if (next) listeners.forEach((listener) => listener(id));
    setVisibleMobile(next);
  }, [id]);

  return { visibleMobile, toggleMobile, setVisibleMobile };
};

export default useExclusiveMobilePanel;
