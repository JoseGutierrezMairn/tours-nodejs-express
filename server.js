const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DB.replace(/<PASSWORD>/g, process.env.DB_PASS);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('DB Connection Successful ✔'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
