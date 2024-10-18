const express = require("express");
const companyRoutes = require("./routes/Company");
const database = require("./config/database");
const cookieParser=require('cookie-parser');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
database.connect();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);


app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});
app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`);
})
module.exports = app;

