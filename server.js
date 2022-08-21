const fs = require('fs');
const path = require('path');

const express = require("express");
const { notes } = require("./develop/db/db");


const PORT = process.env.PORT || 3001;

const app = express();

///////parse incoming string or array data//////
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

///////handle taking data from req.body and adding to db.json file////
function createNewNote(body, notesArray){
    console.log(body);

    const note = body;

    notesArray.push(note)

    fs.writeFileSync(
      path.join(__dirname, "./Develop/db/db.json"),
      JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

///////////handle requests to view ALL notes///////
app.get('/api/notes', (req,res) => {
res.json(notes);
})

/////handle request to post user created notes to server////
app.post('/api/notes', (req,res) => {
  ///req.body is the incoming content///////
  console.log(req.body);

  ///set ID based the next index of array////
  req.body.id = notes.length.toString();

  ////add note to db.json file and notesArray///
  const note = createNewNote(req.body, notes)

  res.json(req.body)
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})