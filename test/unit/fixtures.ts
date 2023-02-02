import fse from "fs-extra";
import chalk from "chalk";
import {
  getLauncherAppPath,
  setupUserDataPath,
} from "../../electron/launcher/file";
import { expect } from "chai";

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
    chalk.green(`${chalk.gray(`[-]`)} userData: ${getLauncherAppPath()}`)
  );

  setupUserDataPath();
  expect(fse.pathExistsSync(getLauncherAppPath())).to.be.true;
});

/**
 * Global after
 */
after(() => {
  // Cleaning up userData (.test_output) directory after used
  console.log(
    chalk.green(`${chalk.gray(`[-]`)} Cleaning up userData directory...`)
  );
  // Empty the dir and remove it
  fse.emptyDirSync(getLauncherAppPath());
  fse.removeSync(getLauncherAppPath());

  expect(fse.pathExistsSync(getLauncherAppPath())).to.be.false;
});
