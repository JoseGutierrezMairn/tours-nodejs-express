const express = require('express');
const tourController = require('./../controllers/tourController');
const { route } = require('./tourRoutes');

const router = express.Router();

// router.param('id', tourController.checkId);


router.use(tourController.fixQueryFilters);
router.use(tourController.setFieldsFromQuery);
router.use(tourController.setSortParam);

router
    .route('/tour-stats')
    .get(tourController.getTourStats)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTourById)


module.exports = router;