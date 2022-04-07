const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

app.use(morgan("tiny"));

morgan.token("logPerson", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :logPerson"));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phone Book</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  let numOf = persons.length;
  let time = new Date();
  response.send(`Phonebook has info for ${numOf} people. <br> ${time}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 9999);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  for (i = 0; i < persons.length; i++) {
    if (body.name === persons[i].name) {
      return response.status(400).json({
        error: "name must be unique",
      });
    } else if (!body.name || !body.number) {
      return response.status(400).json({
        error: "value missing",
      });
    }
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});
