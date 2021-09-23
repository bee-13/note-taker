const express = require("express");
const path = require('path');
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Starts server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

app.get("/api/notes", function (req, res) {
    var newNote = req.body;

    //get the saved data
    var noteArray = JSON.parse(fs.readFileSync(path.join(__dirname, "db/db.json")));
    noteArray.push(newNote);
    
    var reformattedData = JSON.stringify(noteArray);
    fs.writeFileSync(path.join(__dirname, "db/db.json"), reformattedData);

    res.send("Success");
});

app.delete("/api/note/:id", function (req, res) {
    let id = req.params.id;
    
    var noteArray = JSON.parse(fs.readFileSync(path.join(__dirname, "db/db.json")));

    //creates a new note array of every note, except the one that's being deleted
    noteArray = noteArray.filter((value) => { 
        if(value.id != id){
            return value;
        }
    });

    var reformattedData = JSON.stringify(noteArray);
    fs.writeFileSync(path.join(__dirname, "db/db.json"), reformattedData);

    res.send("Success");
});