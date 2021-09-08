import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    position: 'relative',
    maxWidth: '100vw',
    maxHeight: '100vh',
  },
  img: {
    width: '100vw',
    height: '100vh',
  },
  textBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: '20%',
    left: '10%',
    position: 'absolute',
    [theme.breakpoints.only('md')]: {
      top: '10%',
      left: '40%',
    },
    [theme.breakpoints.down('sm')]: {
      top: '10%',
      left: '15%',
    },
  },
  title: {
    fontSize: '72px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textShadow: '5px 3px black',
    color: 'white',
    [theme.breakpoints.down('md')]: {
      fontSize: '52px',
    },
  },
  btn: {
    width: '100vw',
    height: '100vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: 'none',
    backgroundImage:
      'url(https://firebasestorage.googleapis.com/v0/b/campmemo-1fee1.appspot.com/o/Screen%20Shot%202564-09-07%20at%2007.01.35.png?alt=media&token=e24501a4-41d6-45dc-b203-58c321d82d79)',

    '&:active': {
      backgroundImage:
        'url(https://firebasestorage.googleapis.com/v0/b/campmemo-1fee1.appspot.com/o/Screen%20Shot%202564-09-07%20at%2007.02.45.png?alt=media&token=e079e6e0-aa3c-4b29-bf5e-171e65fc1564)',
    },
  },
  text: {
    fontSize: '20px',
    color: 'white',
  },
  form: {
    backgroundColor: 'white',
    border: '2px solid red',
    borderRadius: '10px',
  },
  scoreBox: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '10%',
    left: '10%',
    width: '300px',
    minHeight: '200px',
    padding: '20px',
    textAlign: 'center',
  },
}));
function App() {
  const classes = useStyles();
  const [score, setScore] = useState(0);
  const [allScore, setAllScore] = useState([]);
  const [team, setTeam] = useState(null);
  const [open, setOpen] = useState(true);
  const browser = window.navigator.userAgent.replace(/\D+/g, '');

  useEffect(() => {
    setOpen(true);
    const fetchUser = async () => {
      const currentUser = await axios.post('/user', {
        userId: browser,
        team: team,
      });
      setScore(currentUser.data.score);
      console.log(currentUser.data);
      currentUser.data && setTeam(currentUser.data.team);
      currentUser.data && setOpen(false);
    };
    fetchUser();
  }, [browser, team]);

  useEffect(() => {
    const updateScore = async (req, res) => {
      const newScore = await axios.put('/updateScore/' + browser, {
        score: score,
        team: team,
      });
      const getScore = await axios.get('/score');
      getScore && setAllScore(getScore.data);
    };
    score && updateScore();
  }, [score]);

  const handleClick = () => {
    !open && setScore(score + 1);
  };

  const handleChange = (event) => {
    setTeam(event.target.value);
  };
  console.log(allScore);
  return (
    <Box
      width="100vw"
      height="100vh"
      className={classes.root}
      onClick={handleClick}
    >
      <Box className={classes.textBox}>
        <Typography className={classes.title}>POPCORN</Typography>
        <Typography className={classes.title}>{score}</Typography>

        {team === null && (
          <>
            <Typography className={classes.text}>
              เลือกทีมของคุณ(ครั้งแรกเท่านั้น)
            </Typography>
            <FormControl className={classes.form}>
              <NativeSelect value={team} onChange={handleChange}>
                <option value={'none'} />
                <option value={'north'}>ภาคเหนือ</option>
                <option value={'center'}>ภาคกลาง</option>
                <option value={'northEast'}>ภาคตะวันออกเฉียงเหนือ</option>
                <option value={'west'}>ภาคตะวันตก</option>
                <option value={'east'}>ภาคตะวันออก</option>
                <option value={'south'}>ภาคใต้</option>
              </NativeSelect>
            </FormControl>
          </>
        )}
      </Box>
      <Paper className={classes.scoreBox} onClick={handleClick}>
        <Typography variant="h4" gutterBottom>
          score
        </Typography>
        {allScore &&
          allScore.map((teams) => (
            <>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                key={teams._id}
              >
                <Typography variant="body">{teams.team}</Typography>
                <Typography variant="body">{teams.score}</Typography>
              </Box>
            </>
          ))}
      </Paper>
      <button className={classes.btn}></button>

      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default App;
