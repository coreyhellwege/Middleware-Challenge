const express = require('express');

const app = new express();
const port = 5000;

const users = [
  {
    username: 'jon',
    password: 'password',
    role: 'admin'
  },
  {
    username: 'gretchen',
    password: 'password',
    role: 'big boss'
  },
  {
    username: 'harrison',
    password: 'password',
    role: 'helpful'
  },
  {
    username: 'matt',
    password: 'password',
    role: 'food specialist'
  }
];
app.use(express.json());

app.use((req, res, next) => {
  console.log('running first middleware');
  req.didRunThroughMiddleware = 'we sure did!';
  next();
});

app.use((req, res, next) => {
  console.log('running second middleware');
  next();
});

const checkUser = (req, res, next) => {
  console.log('checking user')
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).send('user does not exist');
  }
  if (user.password !== password) {
    return res.status(401).send('password does not match');
  }
  req.user = user;
  next();
};

const checkBigBoss = (req, res, next) => {
  console.log('checking if user is big boss')
  const { role } = req.body;
  const user = users.find(u => u.role === role);
  if (user.role !== "big boss") {
      return res.status(401).send("you're not authorised");
  }
  // req.user = user;
  next();
};

const checkHelpful = (req, res, next) => {
  console.log('checking if user is helpful')
  const { role } = req.body;
  const user = users.find(u => u.role === role);
  if (user.role !== "helpful") {
      return res.status(401).send("you're too helpful!");
  }
  // req.user = user;
  next();
};

const checkMultipleRoles = (req, res, next) => {
  console.log('checking if user is admin or food specialist')
  const { role } = req.body;
  const user = users.find(u => u.role === role);
  if (user.role !== "admin" && user.role !== "food specialist") {
      return res.status(401).send("You know you're not meant to be here");
  }
  // req.user = user;
  next();
};


// app.use(checkUser());

app.get('/', (req, res) => {
  console.log(req.didRunThroughMiddleware);
  return res.send('hi from api');
}); 

app.post('/auth', checkUser, (req, res) => {
  return res.send(req.user)
});

app.post('/auth/bigboss', checkUser, checkBigBoss, (req, res) => {
  return res.send("welcome Big Boss")
});

app.post('/auth/helpful', checkUser, checkHelpful, (req, res) => {
  return res.send("welcome Harrison!")
});

app.post('/auth/multroles', checkUser, checkMultipleRoles, (req, res) => {
  return res.send("welcome Jon and Matt!")
});

// For the challenge please implement the following routes:
// 1. A new route that only someone with the role `big boss` is allowed to access - everyone else gets a `403: forbidden` response
// 2. A new route that only people with the role `helpful` can access - everyone else gets a `402: You are too helpful!` response
// 3. A new route that people with the role `admin` or `food specialist` can access - everyone else gets a `405: You know you're not meant to be here` response

app.listen(port, () => console.log(`running on ${port}`));