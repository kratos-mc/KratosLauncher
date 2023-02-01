import fse from "fs-extra";
import chalk from "chalk";
import { getUserDataPath } from "../../electron/launcher/file";

/**
 * Global before
 */
before(() => {
  console.log(chalk.green(`${chalk.gray(`[-]`)} cwd: ${process.cwd()}`));
  console.log(
    chalk.green(
      `${chalk.gray(`[-]`)} process.env.NODE_ENV: ${process.env.NODE_ENV}`
    )
  );
  console.log(
    chalk.green(`${chalk.gray(`[-]`)} userData: ${getUserDataPath()}`)
  );
});

/**
 * Global after
 */
after(() => {
  // Cleaning up userData (.test_output) directory after used
  console.log(
    chalk.green(`${chalk.gray(`[-]`)} Cleaning up userData directory...`)
  );

  fse.rmdirSync(getUserDataPath());
});
