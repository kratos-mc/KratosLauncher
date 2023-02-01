const { Parcel } = require("@parcel/core");
const chalk = require("chalk");
const { messageParcelError } = require("./utils/parcel-error-message");
const path = require("path");

(async () => {
  if (process.env.NODE_ENV === "production") {
    console.log(
      chalk.red(
        `${chalk.gray(
          `[~] watch-mode: production have no build-time effect on watch compiler`
        )}`
      )
    );
  }

  try {
    const bundler = new Parcel({
      defaultConfig: "@parcel/config-default",
      entries: ["./render/**/*.html"],
      mode: "development",

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

    bundler.watch((err, buildEvent) => {
      if (err) {
        console.log(chalk.red(`[~] Waiting for renderer change...`));
        throw err;
      }
      if (buildEvent.type === "buildFailure") {
        messageParcelError(buildEvent.diagnostics);
      } else {
        console.clear();
        console.log(chalk.gray(`[Render Builder::]`));
        Array.from(buildEvent.changedAssets.values())
          .map((asset) => path.parse(asset.filePath).base)
          .forEach((filePath) => {
            console.log(
              ` ${chalk.gray(`*`)} ${chalk.green(filePath)} ${chalk.gray()}`
            );
          });
      }
    });
  } catch (err) {
    messageParcelError(err);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
