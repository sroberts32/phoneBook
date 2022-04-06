const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get("/", (request, response) => {
  response.send("<h1>Phone Book</h1>");
});



app.get("/api/persons", (request, response) => {
  response.json(persons);
});


app.get("/info", (request, response) => {
  let numOf = persons.length
  let time = new Date()
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
  Math.floor(Math.random() * 9999999999999)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number ) {
    return response.status(400).json({ 
      error: 'value missing' 
    })
  }

  for (i=0; i<persons.length; i++) {
    if (body.name === persons[i].name) {
      return response.status(400).json({
        error: 'name must be unique'
    })}
  };

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})
