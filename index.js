require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('<div>go to \'/api/persons\' for data or \'/info\'</div>');
});

app.get('/api/persons', (req, res, next) => {
    Person
        .find({})
        .then(persons => {res.json(persons);})
        .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.get('/info', (req, res) => {
  const now = new Date().toLocaleString();
  Person.countDocuments({})
    .then(count => {
      res.send(
        `<div>Phonebook has info for ${count} people</div>
         <div>${now}</div>`
      );
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching info');
    });
});


app.post('/api/persons', (req, res, next) => {
    const p = req.body;

    if (!p.name) {
        return res.status(400).json({
            error: 'name missing'
        });
    } else if (!p.number) {
        return res.status(400).json({
            error: 'number missing'
        });
    }

    const id = Math.floor(Math.random() * 10000);

    const np = new Person({
        name:p.name,
        number:p.number,
        id: id,
    });

    np.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    Person.findByIdAndUpdate(req.params.id, { name, number }, { new:true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
        if (updatedPerson) {
            res.json(updatedPerson);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => next(error));
});


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('server running on port', PORT);
});
