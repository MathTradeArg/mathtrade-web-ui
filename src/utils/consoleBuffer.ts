const BUFFER_CAP = 100;

let buffer: string[] = [];
let initialized = false;

const push = (entry: string) => {
  buffer.push(entry);
  if (buffer.length > BUFFER_CAP) {
    buffer.shift();
  }
};

const format = (level: string, args: unknown[]) => {
  const timestamp = new Date().toISOString();
  const body = args
    .map((arg) => {
      if (typeof arg === "string") return arg;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(" ");
  return `[${timestamp}] ${level}: ${body}`;
};

export const initConsoleBuffer = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  (["log", "warn", "error"] as const).forEach((level) => {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      push(format(level, args));
      original(...args);
    };
  });

  window.addEventListener("error", (event) => {
    push(format("uncaught", [event.message, event.filename, event.lineno]));
  });

  window.addEventListener("unhandledrejection", (event) => {
    push(format("unhandledrejection", [event.reason]));
  });
};

export const getConsoleBuffer = (): string[] => [...buffer];
