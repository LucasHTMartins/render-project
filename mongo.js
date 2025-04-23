const mongoose = require('mongoose');
const argCount = process.argv.length;

if (argCount !== 5 && argCount !== 3) {
    console.log('usage: node mongo.js <password> [<name> <number>]');
    console.log(argCount);
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://lhtm:${password}@cluster0.wfx9vqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (argCount === 3) {
    Person
        .find({})
        .then(persons => {
            console.log('phonebook:');
            persons.forEach(person => console.log(person.name, person.number));
            mongoose.connection.close();
        });
} else {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    newPerson.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
        console.log(result);
        mongoose.connection.close();
    });
}
