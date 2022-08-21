const express = require("express");
const { notes } = require("./develop/db/db");
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();
///////////handle requests for ALL notes///////
app.get('/api/notes', (req,res) => {
res.json(notes);
})




app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})