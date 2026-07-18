const path = require("path");
const { openApiSpec } = require("./openApiSpec");
const yaml = require("js-yaml");

function getOpenApiJson(req, res) {
  return res.status(200).json(openApiSpec);
}

function getOpenApiYaml(req, res) {
  try {
    const doc = yaml.dump(openApiSpec, { noRefs: true });
    res.setHeader('Content-Type', 'application/x-yaml');
    return res.status(200).send(doc);
  } catch (e) {
    return res.status(500).send('Failed to generate YAML');
  }
}

function getSwaggerUi(req, res) {
  const htmlPath = path.resolve(__dirname, "swagger.html");
  return res.sendFile(htmlPath);
}

module.exports = {
  getOpenApiJson,
  getOpenApiYaml,
  getSwaggerUi,
};
