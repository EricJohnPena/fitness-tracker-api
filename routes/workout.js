const express = require("express");
const workoutController = require("../controllers/workout.js");
const { verify} = require('../auth.js');


const router = express.Router();

router.post('/addWorkout', verify, workoutController.addWorkout);

router.get('/getMyWorkouts', verify, workoutController.getWorkout);
router.patch('/updateWorkout/:id', verify, workoutController.updateWorkout);
router.patch('/deleteWorkout/:id', verify, workoutController.removeWorkout);
router.patch('/completeWorkoutStatus/:id', verify, workoutController.completeWorkout);




module.exports = router;