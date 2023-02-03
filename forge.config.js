module.exports = {
  packagerConfig: {
    ignore: [
      ".idea",
      ".gitignore",
      ".github",
      ".git",
      "test",
      ".parcel-cache",
      ".nyc_output",
      ".swcrc",
      "scripts",
      ".postcssrc",
      ".parcelrs",
    ],
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
