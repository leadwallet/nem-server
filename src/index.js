const express = require("express");
const routes = require("./routes");

const port = parseInt(process.env.PORT || "8500");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Provided-By", "Leadwallet");
 next();
});
app.use(routes);

app.listen(port, () => console.log(`Server is running on ${port}`));
