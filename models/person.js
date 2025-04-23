const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'Name is required'],
      minLength: [3, 'Name must be at least 3 characters long']
  },
  number: {
      type: String,
      required: [true, 'Phone numer is required'],
      minLength: [8, 'Number must be at least 8 characters long'],
      validate: {
        validator: (v) => {
            return /^\d{2,3}-\d{1,}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number, use XX-XXXXXX+ or XXX-XXXXX+`
      }
  }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
