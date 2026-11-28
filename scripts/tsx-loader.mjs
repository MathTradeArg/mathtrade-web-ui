import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import ts from "typescript";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const STUBBED = [".scss", ".css", ".svg", ".png", ".jpg", ".jpeg", ".webp"];
const TRANSPILED = [".ts", ".tsx", ".jsx"];

const withExtension = (base) => {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTENSIONS) if (existsSync(base + ext)) return base + ext;
  for (const ext of EXTENSIONS) {
    const index = path.join(base, "index" + ext);
    if (existsSync(index)) return index;
  }
  return null;
};

export async function resolve(specifier, context, next) {
  if (STUBBED.some((ext) => specifier.endsWith(ext))) {
    return { url: "stub:" + specifier, shortCircuit: true };
  }
  let base = null;
  if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (base) {
    const file = withExtension(base);
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  try {
    return await next(specifier, context);
  } catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND" || specifier.startsWith(".")) throw error;
    return next(specifier + ".js", context);
  }
}

export async function load(url, context, next) {
  if (url.startsWith("stub:")) {
    return { format: "module", source: "export default {};", shortCircuit: true };
  }
  if (url.startsWith("file:") && !url.includes("/node_modules/")) {
    const file = fileURLToPath(url);
    const ext = path.extname(file);
    if (ext === ".json") {
      return { format: "json", source: readFileSync(file, "utf8"), shortCircuit: true };
    }
    if (TRANSPILED.includes(ext) || (ext === ".js" && file.startsWith(SRC))) {
      const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
        fileName: file,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      });
      return { format: "module", source: outputText, shortCircuit: true };
    }
  }
  return next(url, context);
}
