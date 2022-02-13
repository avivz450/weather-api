module.exports = {
  // extension: ["ts"],
  // spec: "tests/**/*.spec.ts",
  // require: "@swc-node/register",
  "node-option": [
      "experimental-specifier-resolution=node",
      "loader=ts-node/esm"
  ],
  timeout: "2000"
};