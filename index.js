const express = require('express');
const mongoose = require('mongoose');

const port = 4000;

//server
const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");


app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

//MongoDB connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection to the db failed"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"))


if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}


module.exports = {app,mongoose};