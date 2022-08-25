const fs = require("fs");
const path = require("path");

const express = require("express");
const { notes } = require("./db/db");
console.log('notes is', notes);

const PORT = process.env.PORT || 3001;

const app = express();

///////middleware to parse incoming string or array data//////
app.use(express.urlencoded({ extended: true }));
// middleware to parse incoming JSON data
app.use(express.json());
////middleware to make static files available////
app.use(express.static("public"));

///////handle adding new note to db.json file////
function createNewNote(body, notesArray) {
  console.log(body);
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );

  return note;
}

///////////handle requests to view ALL notes///////
app.get("/api/notes", (req, res) => {
  let results = notes;
  res.json(results);
});

/////handle request to post new notes to the server////
app.post("/api/notes", (req, res) => {
  ///req.body is the incoming content///
  console.log(req.body);
  ///set ID based the next index of array///
  req.body.id = notes.length.toString();
  ////add note to db.json file and notesArray//
  const note = createNewNote(req.body, notes);
  res.json(req.body);
});

//////////handle request to delete a note/////////////////
app.delete('/api/notes/:NoteId', (req, res) =>{
  //access note by using query parameter NoteId
const noteId = req.params.NoteId;

  //read notes in db.json file
const  fileNotes = fs.readFileSync("./db/db.json");

//parse notes in db.json
const { notes: notesInFile } = JSON.parse(fileNotes);

//remove/splice deleted note from db.json file
notesInFile.splice(noteId,1);

//stringify and re-write notes in db.json file
fs.writeFileSync("./db/db.json", JSON.stringify({ notes: notesInFile }));
})

//////////route to serve static files////////////////////
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
