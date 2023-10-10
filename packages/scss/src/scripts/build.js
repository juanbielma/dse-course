const Fs = require("fs");
const Path = require("path");
const Sass = require("node-sass");
const { get } = require("http");

const getComponents = () => {
  let allComponents = [];

  const types = ["atoms", "molecules", "organisms"];

  types.forEach((type) => {
    const components = Fs.readdirSync(Path.resolve(`src/${type}`)).map(
      (file) => ({
        input: `src/${type}/${file}`,
        output: `lib/${file.slice(0, -4) + "css"}`,
      })
    );

    allComponents = [...allComponents, ...components];
  });

  return allComponents;
};

const compile = (path, fileName) => {
  const result = Sass.renderSync({
    data: Fs.readFileSync(Path.resolve(path)).toString(),
    outputStyle: "expanded",
    includePaths: [Path.resolve("src")],
  });

  Fs.writeFileSync(Path.resolve(fileName), result.css.toString());
};

try {
  Fs.mkdirSync(Path.resolve("lib"));
} catch (e) {}

compile("src/global.scss", "lib/global.css");

getComponents().forEach((component) => {
  compile(component.input, component.output);
});
