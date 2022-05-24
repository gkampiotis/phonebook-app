const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms` ));
app.use(cors());


const generateID = () => contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) : 0;

const contacts = [
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



app.get('/info', (request, response) => {
    response.send(`${contacts.length} people in database</br> ${new Date()}`)
});

app.get('/api/contacts/', (request, response) => {
    response.json(contacts);
});
app.get('/api/contacts/:id', (request, response) => {
    const contact = contacts.find(contact => contact.id === Number(request.params.id));
    if (!contact) response.status(404).json({error: "contact not found"});
    response.json(contact);
});
app.delete('/api/contacts/:id', (request, response) => {
    const contact = contacts.find(contact => contact.id === Number(request.params.id));
    //in the course they use notes = notes.filter(note => note.id !== id). Test the differences when storing remote
    response.status(200).end();
});
app.post('/api/contacts/', (request, response) => {
    const body = request.body;
    if (!body) return response.json({error: "content missing"}).end();
    if ((!body.name) || (!body.number)) return response.json({error: "make sure to add Name and Number."}).end();
    if (contacts.find(contact => contact.name.toLocaleLowerCase().includes(body.name.toLocaleLowerCase()))) return response.json({error: "name already exists."}).end();
    
    const newContact = {
        id: generateID(),
        name: body.name,
        number: body.number,
        date: new Date(),
        important: body.important || false
    };

    contacts.concat(newContact);
    response.json(newContact);
});
const unknownEndpoint = (request, response) => response.status(404).send({error: 'unknown endpoint'});
app.use(unknownEndpoint);





const PORT = process.env.PORT || 2009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));