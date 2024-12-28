import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    clean: true,
    dts: true,
    // For debugging, will output ESbuild metafile
    // metafile: true,
    bundle: false,
  },
]);
