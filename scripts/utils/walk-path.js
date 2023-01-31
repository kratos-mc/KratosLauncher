const glob = require("glob");

/**
 *
 * @param {*} globPattern a glob pattern
 * @returns Promise<Array>
 */
function walk(globPattern) {
  return new Promise((resolve, reject) => {
    glob(globPattern, { matchBase: true }, (err, files) => {
      if (err) {
        return reject(err);
      }

      resolve(files);
    });
  });
}

module.exports = {
  walk,
};
