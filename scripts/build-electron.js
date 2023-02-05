const swc = require("@swc/core");
const fs = require("fs");
const path = require("path");
const { walk } = require("./utils/walk-path");
const chalk = require("chalk");

const walkingGlob = "./electron/**/*.+(js|ts)";
const outputDir = `dist`;
const isSilent = process.env.BUILD_LOG_MODE === "silent";

(async () => {
  const files = await walk(walkingGlob);
  if (!isSilent) {
    console.log(chalk.green(`${process.cwd()}/${outputDir} `));
  }
  console.log(`Glob received files: `);
  console.log(files);
  // Transform all files which were walked
  for (const filePath of files) {
    const output = await swc.transform(
      fs.readFileSync(path.join(process.cwd(), filePath), "utf-8"),
      {
        module: {
          type: "commonjs",
        },
        jsc: {
          target: "es2016",
          parser: {
            syntax: "typescript",
            jsx: false,
          },
        },
        // sourceMaps: "inline",
        minify: true,
      }
    );

    const outputFileName = path.join(
      outputDir,
      path.dirname(filePath),
      `${path.basename(filePath, path.extname(filePath))}.js`
    );

    if (!isSilent) {
      console.log(chalk.green(` ${chalk.gray(`*`)} /${filePath}`));
    }
    // Generate output directory if not exist
    if (!fs.existsSync(path.dirname(outputFileName))) {
      fs.mkdirSync(path.dirname(outputFileName), { recursive: true });
    }

    // Write output code into the file
    fs.writeFileSync(outputFileName, output.code);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
