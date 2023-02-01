const { Parcel } = require("@parcel/core");
const chalk = require("chalk");
const { messageParcelError } = require("./utils/parcel-error-message");
const path = require("path");
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

  // const outputGlobFiles = await walk();

  // outputGlobFiles.forEach(async (filePath) => {

  // });

  try {
    const bundler = new Parcel({
      defaultConfig: "@parcel/config-default",
      entries: ["./render/**/*.html"],
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
      console.log();

      console.log(chalk.gray.bold(`Renderer changed assets: `));
      Array.from(buildStatus.changedAssets.values())
        .map((asset) => path.parse(asset.filePath).base)
        .forEach((filePath) => {
          console.log(
            ` ${chalk.gray(`*`)} ${chalk.green.bold(filePath)} ${chalk.gray()}`
          );
        });
      console.log(
        chalk.green(
          `Successfully bundler ${chalk.gray(`(${buildStatus.buildTime} ms)`)}`
        )
      );
    }
  } catch (err) {
    if (err && !err.diagnostics) {
      console.error(err);
    } else {
      messageParcelError(err.diagnostics);
    }
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
