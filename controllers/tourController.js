const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
    Tour.find().then(data => {
        res.status(200).json({
            status: 'success',
            message: 'Query successfully executed',
            data: {
                tours: data
            }
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 'failure',
                message: 'Internal Server Error',
                data: null
            });
        });
};

exports.getTourById = (req, res) => {
    Tour.findById(req.params.id).then(data => {
        if (data !== null) {
            res.status(200).json({
                status: 'success',
                message: 'Query successfully executed',
                data: {
                    tour: data
                }
            });
        } else {
            res.status(404).json({
                status: 'success',
                message: 'Tour not found',
                data: null
            });
        }
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 'failure',
                message: 'Internal Server Error',
                data: null
            });
        });
};

exports.createTour = (req, res) => {
    const { body } = req;
    Tour.create(body).then(data => {
        res.status(201).json({
            status: 'success',
            message: 'Tour has been created',
            data: { tour: data }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 'failure',
                message: 'Unable to save the document',
                data: null
            });
        })
};

exports.updateTour = (req, res) => {
    const { id } = req.params;
    const { body } = req;
    Tour.findByIdAndUpdate(id, body, {
        runValidators: true,
        upsert: false,
        new: true
    })
        .then(data => {
            if (data !== null) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Tour has been updated',
                    data: { tour: data }
                });
            }
            res.status(404).json({
                status: 'failure',
                message: 'Tour not found',
                data: null
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 'failure',
                message: 'Internal Server Error',
                data: null
            });
        });
}


exports.deleteTourById = (req, res) => {
    Tour.findByIdAndDelete(req.params.id).then(data => {
        if (data !== null) {
            return res.status(200).json({
                status: 'success',
                message: 'Tour has been deleted',
                data: { tour: data }
            });
        }
        return res.status(404).json({
            status: 'failure',
            message: 'Tour not found',
            data: null
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 'failure',
                message: 'Unable to delete the document',
                data: null
            });
        });

};