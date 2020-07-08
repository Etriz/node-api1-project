const express = require("express");
const shortid = require("shortid");
const { json } = require("express");

const server = express();

let users = [{ id: "01", name: "Ryan", bio: "project creator" }];

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ message: "its working!" });
});

server.get("/api/users", (req, res) => {
  try {
    res.json(users);
  } catch (error) {
    res.status(500).json({ errorMessage: "The users information could not be retrieved." }, error);
  }
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const found = users.find((user) => user.id === id);

  try {
    found
      ? res.status(200).json(found)
      : res.status(404).json({ message: "The user with the specified ID does not exist." });
  } catch (error) {
    res.status(500).json({ errorMessage: "The user information could not be retrieved." }, error);
  }
});

server.post("/api/users", (req, res) => {
  const userInfo = req.body;

  userInfo.id = shortid.generate();

  try {
    if (userInfo.name === undefined || userInfo.bio === undefined) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      users.push(userInfo);

      res.status(201).json(userInfo);
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "There was an error while saving the user to the database" });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const deleted = users.find((user) => user.id === id);
  try {
    deleted
      ? ((users = users.filter((user) => user.id !== id)), res.status(200).json(deleted))
      : res.status(404).json({ message: "The user with the specified ID does not exist." });
  } catch (error) {
    res.status(500).json({ errorMessage: "The user could not be removed" }, error);
  }
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  changes.id = id;

  try {
    if (changes.name === undefined || changes.bio === undefined) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      let index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        users[index] = changes;
        res.status(200).json(users[index]);
      } else {
        res.status(404), json({ message: "The user with the specified ID does not exist." });
      }
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "The user information could not be modified." }, error);
  }
});

// server.patch("/api/users/:id", (req, res) => {
//   const { id } = req.params;
//   const changes = req.body;

//   let found = users.find((user) => user.id === id);

//   if (found) {
//     Object.assign(found, changes);
//     res.status(200).json(found);
//   } else {
//     res.status(404), json({ message: "user id not found" });
//   }
// });

const PORT = 5000;
server.listen(PORT, () => console.log(`Server listening on localhost:`, PORT));
