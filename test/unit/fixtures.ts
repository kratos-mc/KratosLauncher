import chalk from "chalk";

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
});

/**
 * Global after
 */
after(() => {});
