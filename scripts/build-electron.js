const swc = require("@swc/core");
const fs = require("fs");
const path = require("path");
const { walk } = require("./utils/walk-path");
const chalk = require("chalk");

const walkingGlob = path.join("./electron/**/*.+(js|ts)");
const outputDir = `./dist`;

walk(walkingGlob)
  .then((files) => {
    console.log(chalk.green(`${outputDir} `));

    // Transform all files which were walked
    files.map((filePath) => {
      swc
        .transform(
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
        )
        .then((output) => {
          const outputFileName = path.join(
            outputDir,
            path.dirname(filePath),
            `${path.basename(filePath, path.extname(filePath))}.js`
          );
          console.log(chalk.green(` ${chalk.gray(`*`)} /${filePath}`));
          // Generate output directory if not exist
          if (!fs.existsSync(path.dirname(outputFileName))) {
            fs.mkdirSync(path.dirname(outputFileName), { recursive: true });
          }

          // Write output code into the file
          fs.writeFileSync(outputFileName, output.code);
        });
    });
  })
  .catch((err) => console.error(err));
