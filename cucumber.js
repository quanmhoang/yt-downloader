const common = [
    "tests/features/**/*.feature", // Specify our feature files
    "--require-module ts-node/register", // Load TypeScript module
    "--require tests/step-definitions/**/*.ts", // Load step definitions
    //"-f progress-bar", // Load custom formatter
    "-f @cucumber/pretty-formatter", // Load custom formatter
].join(" ");

module.exports = {
    default: common,
};
