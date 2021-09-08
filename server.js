const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/user');
const Team = require('./model/team');

app.use(express.json());

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('connected to mongodb'))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

//newuser first
app.post('/api/user/', async (req, res) => {
  try {
    const checkUser = await User.findOne({ browserId: req.body.userId });
    if (checkUser) {
      if (!checkUser.team) {
        const teamUser = await User.findOneAndUpdate(
          { browserId: req.body.userId },
          {
            $set: { team: req.body.team },
          },
          { new: true }
        );
        res.status(200).json(teamUser);
      }
    }
    console.log(checkUser);
    if (checkUser) {
      res.status(200).json(checkUser);
    } else {
      console.log(checkUser);
      const newUser = await User.create({
        browserId: req.body.userId,
        team: req.body.team,
      });
      res.status(200).json(newUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//create team
app.post('/api/createteam', async (req, res) => {
  try {
    const newTeam = await Team.create({
      team: req.body.team,
      score: req.body.score,
    });
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user score
app.put('/api/updateScore/:id', async (req, res) => {
  try {
    const newScore = await User.findOneAndUpdate(
      { browserId: req.params.id },
      {
        $set: { score: req.body.score },
      },
      { new: true }
    );
    const newAllScore = await Team.findOneAndUpdate(
      { team: req.body.team },
      {
        $set: { score: req.body.score },
      },
      { new: true }
    );
    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json(err);
  }
});

//getall score
app.get('/api/score', async (req, res) => {
  try {
    const score = await Team.find();
    res.status(200).json(score);
  } catch (err) {
    res.status(500).json(err);
  }
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get(path.join(__dirname, 'client', 'build', 'index.html'));
} else {
  app.get('/', (req, res) => {
    res.send('api running');
  });
}

app.listen(process.env.PORT || 5000, () => {
  console.log('connect to backend');
});
