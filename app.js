const express = require('express');
const fs = require('fs');

const app = express();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware ✌');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});




const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res
        .status(200)
        .json({
            status: 'success',
            data: { tours }
        });
};

const getTourById = (req, res) => {
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

const createTour = (req, res) => {
    const { body } = req;
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if (err) console.log('Could not update the database');
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        });
    })

};

const deleteTourById = (req, res) => {
    const id = req.params.id * 1;
    const newTours = tours.filter(tour => tour.id !== id);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), err => {
        if (err) {
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



app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app
    .route('/api/v1/tours/:id')
    .get(getTourById)
    .delete(deleteTourById)


const port = 8080;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});


