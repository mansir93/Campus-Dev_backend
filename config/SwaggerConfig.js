const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a Social Media API application made with Express and documented with Swagger",
      license: {
        name: "DTD License",
        url: "",
      },
      contact: {
        name: "Mansir Abdul Aziz",
        url: "/",
        email: "mansiraziz93@email.com",
      },
    },
    servers: [
      {
        url: "https://api-campus-dev.vercel.app",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};
const specs = swaggerJsdoc(options);

const UIopts = {
  customSiteTitle: "Campus dev",
  explorer: true,
  customfavIcon: "",
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css",
};
const swaggerUiServe = swaggerUi.serve;
const swaggerUiSetup = swaggerUi.setup(specs, UIopts);

module.exports = { swaggerUiServe, swaggerUiSetup };
