require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};


const app = express();
const cors = require("cors");
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("build"));

app.get("/info", (request, response) => {
    response.send(
        `<div>Phonebook has info for ${
            persons.length
        } people</div><div>${new Date()}</div>`
    );
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response, next) => { // add next
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });    
});

app.delete("/api/persons/:id", (request, response) => { 
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing",
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
