const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const { json } = require('express');


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(201).json({books});
});
//all books async
public_users.get("/server/asynbooks", async function (req,res) {
    try {
      let response = await axios.get("http://localhost:5000/");
      console.log(response.data);
      return res.status(200).json(response.data);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Error listing books"});
    }
  });
// book details promises isbn
  public_users.get("/server/asynbooks/isbn/:isbn", function (req,res) {
    let {isbn} = req.params;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error fetching book details."})
    })
  });
// promises details by title
  public_users.get("/server/asynbooks/title/:title", function (req,res) {
    let {title} = req.params;
    axios.get(`http://localhost:5000/title/${title}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error fetching book details."})
    })
  });

  // promises details by author
  public_users.get("/server/asynbooks/author/:author", function (req,res) {
    let {author} = req.params;
    axios.get(`http://localhost:5000/author/${author}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error fetching book by author."})
    })
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    
    const isbn = req.params.isbn;
      if (books[isbn]) {
          return res.json(books[isbn]);
      } else {
          return res.status(404).json({ message: "Not found" });
      }
       });  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    const author = req.params.author;  
    const authorBooks = [];  
    
    for (let book in books) {  
      if (books[book].author === author) {  
        authorBooks.push(books[book]);
      }
    }
    
    if (authorBooks.length > 0) {  
      res.send(authorBooks);  
    } else {
      res.status(404).send('No books found');  
    }
  });


  public_users.get('/title/:title',function (req, res) {
    
    const title = req.params.title.toLowerCase();
      const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
      if(filteredBooks.length > 0){
          return res.status(200).json(filteredBooks);
      }
      else{
          return res.status(404).json({message: "Not found"});
      }
    
    });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
      let isbn = req.params.isbn;
      if (!books[isbn]) {
          return res.status(404).json({ message: "Book not found" });
      }
      const reviews = books[isbn].reviews;
      return res.status(200).json({ reviews: reviews });
      });
  

module.exports.general = public_users;
