const Workout = require('../models/Workout');
const { errorHandler } = require('../auth');

module.exports.addWorkout = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).send({
                message: 'Admin is forbidden'
            });
        }

        const { name, duration } = req.body;
        const userId = req.user.id;

        if (!name || !duration || String(name).trim() === '' || String(duration).trim() === '') {
            return res.status(400).send({ message: 'Invalid input' });
        }

        const newWorkout = new Workout({
            userId,
            name: name.trim(),
            duration
        });

        const savedWorkout = await newWorkout.save();

        return res.status(201).send(savedWorkout);
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getWorkout = (req, res) => {
    
    return Workout.find({ userId: req.user.id })
    .then(workouts => {
        if (!workouts) {
            return res.status(404).send({ message: "Workout not found" });
        }
        return res.status(200).send({ workouts });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = async (req, res) => {
    try {
        if (req.user?.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        const userId = req.user?.id || req.user?._id;
        const id = req.params.id; 
        const { name, duration } = req.body;

        if (!name || !duration || String(name).trim() === '' || String(duration).trim() === '') {
            return res.status(400).send({ message: 'Invalid input' });
        }

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, userId },
            {
                name: String(name).trim(),
                duration
            },
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return res.status(404).send({ message: 'Workout not found' });
        }

        return res.status(200).send({
            message: 'Workout updated successfully',
            updatedWorkout
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.removeWorkout = async (req, res) => {
    try {
        if (req.user?.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }

        const userId = req.user?.id || req.user?._id;
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ message: "Workout ID is required in URL parameter" });
        }

        const deletedWorkout = await Workout.findOneAndDelete({ _id: id, userId });

        if (!deletedWorkout) {
            return res.status(404).send({ message: "Workout not found" });
        }

        return res.status(200).send({
            message: "Workout deleted successfully"
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.completeWorkout = async (req, res) => {
    try {
        if (req.user?.isAdmin) {
            return res.status(403).send({ message: "Admin is forbidden" });
        }
        const userId = req.user?.id || req.user?._id;
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ message: "Workout ID is required in URL parameter" });
        }
        
        const workout = await Workout.findById({ _id: id, userId });
        if(!workout){
            return res.status(404).send({
                    message: "Workout not found"
            });
        }

        if(workout.status === 'completed'){
            return res.status(200).send({
                    message: "Workout status is already completed",
                    workout: workout
                });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            {status: 'completed'},
            {new: true});
        
        
        return res.status(200).send({
                    message: "Workout status updated successfully",
                    updatedWorkout: updatedWorkout
                });


    } catch (error) {
        
    }
}