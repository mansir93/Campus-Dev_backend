const express = require("express");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const PORT = process.env.PORT || 5001;
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a Social Media API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Mansir Abdul Aziz",
        url: "/",
        email: "mansiraziz93@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const uiOpts = {
  customSiteTitle: "Campus dev",
  customfavIcon: "/assets/favicon.ico",
};
app.use("/assets", express.static("assets"));

/*
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, uiOpts));
*/
const specs = swaggerJsdoc(options);
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(specs, uiOpts, {
    customCssUrl: CSS_URL,
    explorer: true,
  })
);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});
