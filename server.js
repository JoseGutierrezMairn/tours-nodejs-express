const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace(/<PASSWORD>/g, process.env.DB_PASS);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('DB Connection Successful ✔'));

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    defaul: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});


const Tour = mongoose.model('Tour', tourSchema);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
