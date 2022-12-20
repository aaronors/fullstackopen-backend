require("dotenv").config();
const express = require("express");
const morgan = require('morgan')
const Person = require("./models/person");

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static('build'));

app.get("/info", (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`);
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
    return maxId + 1;
};

app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log(body);


    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        });
    } else if(persons.find((person) => person.name.localeCompare(body.name, undefined, { sensitivity: 'accent' }) === 0)){
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    persons = persons.concat(person);

    response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
