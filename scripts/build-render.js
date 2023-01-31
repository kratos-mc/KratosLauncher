const { Parcel } = require("@parcel/core");
const chalk = require("chalk");
const { messageParcelError } = require("./utils/parcel-error-message");

const { walk } = require("./utils/walk-path");

(async () => {
  if (process.env.NODE_ENV === "production") {
    console.log(
      chalk.yellow(
        `${chalk.gray(
          `[~] building/bundling render on production mode`
        )}  (can take longer build time)`
      )
    );
  }

  const outputGlobFiles = await walk("./render/**/*.html");

  // outputGlobFiles.forEach(async (filePath) => {

  // });

  try {
    const bundler = new Parcel({
      defaultConfig: "@parcel/config-default",
      entries: outputGlobFiles,
      mode:
        process.env.NODE_ENV === "production" ? "production" : "development",

      targets: {
        reactRender: {
          context: "browser",
          distDir: "./dist/render",
          publicUrl: "./../",
          engines: {
            node: ">= 14",
          },
        },
      },
    });

    const buildStatus = await bundler.run();
    if (buildStatus.type === "buildSuccess") {
      outputGlobFiles.forEach((filePath) => {
        console.log(
          ` ${chalk.gray(`*`)} ${chalk.green(filePath)} ${chalk.gray(
            `and included item...`
          )}`
        );
      });
    }
  } catch (err) {
    messageParcelError(err.diagnostics);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
