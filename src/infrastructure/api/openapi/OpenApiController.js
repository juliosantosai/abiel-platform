const path = require("path");
const { openApiSpec } = require("./openApiSpec");

function getOpenApiJson(req, res) {
  return res.status(200).json(openApiSpec);
}

function getOpenApiYaml(req, res) {
  const yamlPath = path.resolve(__dirname, "openapi.yaml");
  return res.sendFile(yamlPath);
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
