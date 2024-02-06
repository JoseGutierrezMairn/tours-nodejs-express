const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, value) => {
    console.log(`El valor de value es: ${value}`);
    if (value * 1 > tours.length) {
        return res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        });
    }
    next();
}

exports.checkBody = (req, res, next) => {
    console.log('Checking the body');
    const { body } = req;
    if (!(body.hasOwnProperty('name') && body.hasOwnProperty('price'))) {
        return res.status(400).json({
            status: 'failure',
            message: 'Body does not contain required properties'
        });
    }
    next();
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res
        .status(200)
        .json({
            status: 'success',
            data: { tours }
        });
};

exports.getTourById = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(t => t.id === id);
    var statusCode = 200;
    var status = 'success';
    if (!tour) {
        statusCode = 404;
        status = 'not found'
    }
    res
        .status(statusCode)
        .json({
            status: status,
            data: { tour }
        });
};

exports.createTour = (req, res) => {
    const { body } = req;
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if (err) console.log('Could not update the database');
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        });
    })

};

exports.deleteTourById = (req, res) => {
    const id = req.params.id * 1;
    const newTours = tours.filter(tour => tour.id !== id);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(newTours), err => {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: 'failure',
                data: null
            })
            console.log('Could not delete de tour from database');
        }
        else {
            res.status(200).json({
                status: 'success',
                data: null
            })
        }
    })
};