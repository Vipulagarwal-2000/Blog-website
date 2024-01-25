import express from 'express';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let arr = [];

let currentDate = new Date(); 
let timestamp = currentDate.toLocaleString();  
const time =timestamp;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {

res.render("index.ejs", { vdata:arr, date: time});
});

app.get("/create", (req, res) => {  //you need to send the data to the express server in post reuest
  res.render("message.ejs",{
    idnum: "1",
    mhead: '',
    shead: '',
    text: '',
    author:'',
    date: time
  });
}
);

app.post("/", async (req, res) => {
  const id = req.body.idnum;   // Extract id from the request body
  const mhead = req.body.mhead; // Extract other properties from the request body
  const shead = req.body.shead;
  const text = req.body.text;
  const author = req.body.author;

  // Find the index of the existing object in the array based on the id
  const existingIndex = arr.findIndex(obj => obj.id === id);

  if (existingIndex !== -1) {
    // If an existing object is found, update its properties
    arr[existingIndex].bhead = mhead;
    arr[existingIndex].lhead = shead;
    arr[existingIndex].input = text;
    arr[existingIndex].writer = author;
  } else {
    // If no existing object is found, create a new one and push it to the array
    const newObj = { id: id, bhead: mhead, lhead: shead, input: text, writer: author };
    arr.push(newObj);
  }

  // Render the "index.ejs" template with the updated array as vdata
  res.render("index.ejs", { vdata: arr, date: time});

  // Log the updated array to the console for debugging
  console.log(arr);
});


app.post("/patch", async (req, res) => {
  const originalId = req.body.ctpiId; // Original id to identify the object
  const updatedId = req.body.ctpiId; // Updated id
  const updatedMhead = req.body.ctpiMhead;
  const updatedShead = req.body.ctpiShead;
  const updatedText = req.body.ctpiText;
  const updatedAuthor = req.body.ctpiAuthor;

  // Find the object with the original id in the array
  const existingObject = arr.find(obj => obj.id === originalId);

  if (existingObject) {
    // Update the object with the updated values
    existingObject.id = updatedId;
    existingObject.bhead = updatedMhead;
    existingObject.lhead = updatedShead;
    existingObject.input = updatedText;
    existingObject.writer = updatedAuthor;

    // Render the "message.ejs" template with the existing values
    res.render("message.ejs", {
      idnum: existingObject.id,
      mhead: existingObject.bhead,
      shead: existingObject.lhead,
      text: existingObject.input,
      author: existingObject.writer,
      date: time
    });
  } else {
    // If the object with the original id is not found, handle the error or redirect as needed
    res.redirect("/"); // Redirect to the home page for example
  }
});





app.post("/delete", async (req, res) => {
  const contentToDeleteId = req.body.contentToDeleteId; // Change the name to match the form input
  console.log("Content to delete (ID):", contentToDeleteId);

  // Perform deletion logic based on the content (assuming id is the property to match)
  arr = arr.filter(element => element.id !== contentToDeleteId);

  let unique = [];
  arr.forEach(element => {
      if (!unique.some(obj => obj.id === element.id)) {
          unique.push(element);
      }
  });

  res.render("index.ejs", { vdata: unique, date: time });
});


 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


