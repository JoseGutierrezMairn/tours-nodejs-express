const express = require('express');
const fs = require('fs');

const app = express();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.use(express.json());


app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            data: { tours }
        });
});

app.post('/api/v1/tours', (req, res) => {
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

});

const port = 8080;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});


