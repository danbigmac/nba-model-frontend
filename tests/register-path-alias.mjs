import Module from "module";
import path from "path";

const compiledSrcRoot = path.resolve(import.meta.dirname, "..", ".test-dist", "src");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (typeof request === "string" && request.startsWith("@/")) {
    const mapped = path.join(compiledSrcRoot, request.slice(2));
    return originalResolveFilename.call(this, mapped, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
