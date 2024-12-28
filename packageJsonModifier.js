/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

// Modify package.json main prop before publishong
const fs = require("fs");

function chagePackageJson() {
  const input = process.argv[2];
  if (!input) {
    console.error("input arg not provided");
    return 1;
  }

  const output = process.argv[3];
  if (!output) {
    console.error("output arg not provided");
    process.exitCode = 1;
    return;
  }

  if (output === input) {
    console.error("output and input cannot be the same");
    process.exitCode = 1;
    return;
  }

  const obj = JSON.parse(fs.readFileSync(input, "utf8"));
  obj.main = "index.js";
  obj.types = "index.d.ts";

  fs.writeFileSync(output, JSON.stringify(obj).replace(/,/gi, ",\n"));
}

chagePackageJson();
