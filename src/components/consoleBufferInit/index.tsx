"use client";
import { useEffect } from "react";
import { initConsoleBuffer } from "@/utils/consoleBuffer";

const ConsoleBufferInit = () => {
  useEffect(() => {
    initConsoleBuffer();
  }, []);

  return null;
};

export default ConsoleBufferInit;
