const chalk = require("chalk");
const yargs = require("yargs");
const path = require("path");
const globSync = require("glob/sync");

const { existsSync, rmSync } = require("fs");
const { hideBin } = require("yargs/helpers");

const distItems = ["./dist/**/*", ".parcel-cache/**/*"];
yargs(hideBin(process.argv))
  .command(
    "build <type>",
    "build and bundle the application",
    (yargs) => {
      yargs
        .positional("type", {
          desc: "target to build",
          choices: ["electron", "render", "all"],
          default: "all",
        })

        .options("p", { alias: "production" })
        .options("s", { alias: "silent" });
    },
    (args) => build(args)
  )
  .command(
    "clean",
    "clean launcher bundling item / cache",
    (yargs) => {},
    (args) => clean(args)
  )
  .demandCommand(1, ``)
  .help()
  .parse();

/**
 *
 * @param {*} args an argument list to execute the command
 */
function build(args) {
  if (args.production) {
    process.env.NODE_ENV = "production";
  }
  if (args.silent) {
    process.env.BUILD_LOG_MODE = "silent"
  }
  if (args.type === `render` || args.type === `all`) {
    console.log(chalk.green(`* Starting to build a render(react) application`));
    require("./build-render");
  }
  if (args.type === `electron` || args.type === `all`) {
    console.log(chalk.green(`* Starting to build an electron application`));
    require("./build-electron");
  }
}

function clean(_args) {
  let parent = [];
  console.log(chalk.yellow(`Removing items `));
  // Walking through all items and remove it
  distItems
    .map((item) => globSync(item))
    .flat()
    .forEach((item) => {
      // console.log(item);
      console.log(`   ${chalk.gray(`*`)} ${chalk.green(item)}`);
      parent.push(path.dirname(item));
      if (existsSync(item)) {
        rmSync(item, { recursive: true, force: true });
      }
    });

  // Then remove parent directory
  parent.forEach((item) => {
    if (existsSync(item)) {
      rmSync(item, { recursive: true, force: true });
    }
  });
}
