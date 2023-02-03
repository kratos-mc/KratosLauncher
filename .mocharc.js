module.exports = {
  color: true,
  file: ["./test/unit/fixtures.ts"],
  spec: ["test/unit/**/*.spec.ts", "electron/**/*.spec.ts"],
  exclude: ["/test/e2e/**/*.spec.ts"],
  require: ["ts-node/register", "dotenv/config"],
};
