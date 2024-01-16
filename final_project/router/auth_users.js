const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    
      const user = users.find(u => u.username === username && u.password === password);
      return !!user;
    }

    regd_users.post("/login", (req,res) => {
        const {username, password} = req.body;
        
        // check if username and password are provided
        if (!username || !password) {
          return res.status(400).json({message: "Username and/or password missing."});
        }
      
        // check if user is registered
        const user = users.find(u => u.username === username);
        if (!user) {
          return res.status(401).json({message: "Login error."});
        }
      
        // check if password is correct
        if (user.password !== password) {
          return res.status(401).json({message: "Login Error."});
        }
      
        // generate JWT token
        const accessToken = jwt.sign({ username: user.username }, 'supersecretstring');
      
        // save token in session
        req.session.accessToken = accessToken;
      
        // return success message with access token
        return res.json({message: "Logged In.", accessToken});
      });
      
      regd_users.put("/auth/review/:isbn", (req, res) => {
        const username = req.session.username;
        const isbn = req.params.isbn;
        const review = req.query.review;
        console.log(username);
        if (!review) {
          return res.status(400).json({message: "Review Empty"});
        }
        if (!books[isbn]) {
          return res.status(404).json({message: "ISBN not found"});
        }
        if (!books[isbn].reviews) {
          books[isbn].reviews = {};
        }
        if (books[isbn].reviews[username]) {
          books[isbn].reviews[username] = review;
          return res.json({message: "Modified successfully"});
        }
        books[isbn].reviews[username] = review;
        return res.json({message: "Added successfully"});
      });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
