const express = require("express");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const passportConfig = require("./config/passport")
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/dbConnection");
const ErrorHandler = require("./middleware/errorHandler");
// const cloudinary = require("./config/cloudinaryConfig");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const PORT = process.env.PORT || 5001;
const app = express();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const passport = require("passport");

app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Enable CORS for all routes
const corsOptions = {
  origin: ["http://localhost:3000", "https://campus-dev.vercel.app"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};
app.use(cors(corsOptions));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(ErrorHandler);
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/auth/", authRoutes);
app.use("/user/", userRoutes);
app.use("/post/", postRoutes);
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Route not found. Please check the URL.' });
// });

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
app.use("/", swaggerUi.serve, swaggerUi.setup(specs, UIopts));

app.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});
