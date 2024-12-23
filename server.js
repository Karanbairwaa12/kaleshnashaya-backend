const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');


const authRoutes  = require("./router/authRoutes");
const userRoute = require('./router/userRoutes');
const pdfRoutes = require("./router/pdfRoutes")
const templateRoute = require('./router/tamplateRoutes')


const dbConnection = require("./utils/configs/db/db.config");
const swaggerSpec = require('./utils/configs/swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/auth", authRoutes);
app.use("/user", userRoute);
app.use("/api/pdf", pdfRoutes);
app.use("/template", templateRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
})

app.get("/page", (req, res) => {
    res.send("Welcome to the API!");
})
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});