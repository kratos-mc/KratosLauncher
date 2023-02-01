const chalk = require("chalk");

function messageParcelError(diagnostics) {
  if (!diagnostics) {
    throw new Error("no error was detected");
  }
  if (diagnostics) {
    diagnostics.forEach((diagnostic) => {
      console.log(chalk.red(`* ${diagnostic.message}`));
      console.log(
        diagnostic.hints
          ? chalk.yellow(`   ${diagnostic.hints}`)
          : chalk.gray(`   <no hints was suggested>`)
      );
      console.log(chalk.gray(`   ${diagnostic.origin}`));
      console.log();
      // Loop code frame escape
      if (diagnostic.codeFrames) {
        diagnostic.codeFrames.forEach((frame) => {
          console.log(chalk.yellow(`   ~ ${frame.filePath}`));

          // Code highlights test
          frame.codeHighlights.forEach((highlight) => {
            console.log(
              chalk.gray(
                `     start: ${highlight.start.line}:${highlight.start.column}`
              )
            );
            console.log(
              chalk.gray(
                `     end: ${highlight.end.line}:${highlight.end.column}`
              )
            );
            console.log(
              chalk.gray(`    ${highlight.message || `<no message>`}`)
            );
          });
        });
      }
    });
  } else {
    console.error(error);
  }
}
module.exports = {
  messageParcelError,
};
