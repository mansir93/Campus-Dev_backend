const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/passport");
require("./config/cloudinaryConfig");

const connectDB = require("./config/dbConnection");
const ErrorHandler = require("./middleware/errorHandler");
const { swaggerUiServe, swaggerUiSetup } = require("./config/SwaggerConfig");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const PORT = process.env.PORT || 5001;
const app = express();
connectDB();

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

// middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/auth/", authRoutes);
app.use("/user/", userRoutes);
app.use("/post/", postRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found. Please check the URL.' });
});

app.use("/", swaggerUiServe, swaggerUiSetup);


app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});
