const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const cors = require("cors");
app.use(cors());


const PORT = 3001;

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("<div>go to '/api/persons' for data</div>");
});

app.get("/api/persons", (req, res) => {
    res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const note = data.find(p => p.id === id);
    if (!note) {
        res.status(404).end();
    } else {
        res.json(note);
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    data = data.filter(p => p.id !== id)
    console.log("deleting: ", id);
    res.status(204).end();
});

app.get("/info", (req, res) => {
    const now = new Date().toLocaleString();
    res.send(
        `<div>Phonebook has info for ${data.length} people</div>
        <div>${now}<div>`
    )
});

app.post("/api/persons", (req, res) => {
    const p = req.body;

    if (!p.name) {
        return res.status(400).json({
            error: "name missing"
        })
    } else if (!p.number) {
        return res.status(400).json({
            error: "number missing"
        })
    } else if (data.some(person => person.name.toLowerCase() === p.name.toLowerCase())) {
        return res.status(400).json({
            error: "name already exists"
        })
    }

    const id = Math.floor(Math.random() * 10000);

    const np = {
        name:p.name,
        number:p.number,
        id: id,
    };

    data = data.concat(np);
    res.json(np);
});

app.listen(PORT, () => {
    console.log("server running");
});
