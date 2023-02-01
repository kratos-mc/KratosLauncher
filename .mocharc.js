module.exports = {
  color: true,
  file: ["./test/unit/fixtures.ts"],
  spec: ["test/**/*.spec.ts", "electron/**/*.spec.ts"],
  require: ["ts-node/register", "dotenv/config"],
};
