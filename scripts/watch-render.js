const { Parcel } = require("@parcel/core");
const chalk = require("chalk");
const { messageParcelError } = require("./utils/parcel-error-message");

const { walk } = require("./utils/walk-path");

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

  const outputGlobFiles = await walk("./render/**/*.html");

  try {
    const bundler = new Parcel({
      defaultConfig: "@parcel/config-default",
      entries: outputGlobFiles,
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
        outputGlobFiles.forEach((filePath) => {
          console.log(
            ` ${chalk.gray(`*`)} ${chalk.green(filePath)} ${chalk.gray(
              `and included item...`
            )}`
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
