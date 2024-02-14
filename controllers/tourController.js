const Tour = require('./../models/tourModel');

exports.fixQueryFilters = (req, res, next) => {
    let queryParams = JSON.stringify(req.query);
    queryParams = queryParams.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    req.query = JSON.parse(queryParams);
    next();
};

exports.setFieldsFromQuery = (req, res, next) => {
    let fields = '-__v';
    if (req.query.fields) {
        fields = req.query.fields.split(',').join(' ');
    }
    req.query.fields = fields;
    next();
}

exports.setSortParam = (req, res, next) => {
    if (req.query.sort) {
        req.query.sort = req.query.sort.split(',').join(' ');
    }
    next();
}

exports.getAllTours = async (req, res) => {
    const query = { ...req.query };
    const elementsToDelete = ['page', 'sort', 'limit', 'fields'];
    elementsToDelete.forEach(el => delete query[el]);
    const skip = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    Tour.find(query)
        .sort(req.query.sort)
        .select(req.query.fields)
        .skip((skip - 1) * limit)
        .limit(limit)
        .then(data => {
            res.status(200).json({
                status: 'success',
                message: 'Query successfully executed',
                data: {
                    tours: data
                }
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


exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]);

        return res.status(200).json({
            status: 'success',
            data: {
                stats: { stats }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'failure',
            message: 'Unable to get information from data base',
            data: null
        });
    }
}



exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0,
                }
            },
            {
                $sort: {
                    numTourStarts: -1
                }
            },
            {
                $limit: 6
            }
        ]);

        return res.status(200).json({
            status: 'success',
            data: { plan }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'failure',
            message: 'Unable to get information from data base',
            data: null
        });
    }
}