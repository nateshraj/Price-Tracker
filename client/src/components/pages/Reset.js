import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Appbar';
import { Typography, Grid, Paper, makeStyles, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, Button } from '@material-ui/core';
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    outline: '2px',
    outlineStyle: 'solid'
  },
  buttonColor: {
    backgroundColor: 'black',
    color: 'white'
  }
}));

const Reset = (props) => {
  const classes = useStyles();

  const { resetToken } = useParams();

  const [values, setValues] = useState({
    validToken: false,
    text: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    passwordError: false,
    confirmPasswordError: false,
    errorMessage: ''
  });

  const resetEmail = async () => {
    try {
      const res = await axios.get(`/api/reset/${resetToken}`);
      setValues({ ...values, validToken: true, text: res.data });
    } catch (e) {
      e.response.data ? setValues({ ...values, validToken: false, text: e.response.data }) : setValues({ ...values, validToken: false, text: 'Unable to reset account, please try again later. If you are facing issues, write to nateshrajs@gmail.com' });
    }
  }

  useEffect(() => {
    resetEmail(); // eslint-disable-next-line
  }, [])

  const { validToken, text, password, confirmPassword, passwordError, confirmPasswordError, errorMessage } = values;

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleClickShowPassword = (prop) => setValues({ ...values, [prop]: !values[prop] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setValues({ ...values, passwordError: true, confirmPasswordError: false, errorMessage: 'Passwords should be atleast 6 characters' });
    } else if (password !== confirmPassword) {
      setValues({ ...values, passwordError: true, confirmPasswordError: true, errorMessage: 'Passwords do not match' });
    } else {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      }
      await axios.post('/api/reset-password', { resetToken, password }, config);
      // console.log('Reset');
      props.history.push('/login');
      // setTimeout(() => props.history.push('/login'), 5000);
    }
  }

  return (
    <React.Fragment>
      <Navbar />
      <br /><br />
      <Typography gutterBottom variant="h4" align="center" >
        {text}
      </Typography>
      <br />

      {validToken && (
        <Grid container justify="center">
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              <form onSubmit={handleSubmit}>

                {!passwordError ? (
                  <FormControl variant="outlined" margin="normal" fullWidth required>
                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                    <OutlinedInput
                      name="password"
                      id="outlined-adornment-password"
                      type={values.showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleClickShowPassword('showPassword')} edge="end">
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      } labelWidth={120} />
                  </FormControl>
                ) : (
                    <FormControl variant="outlined" margin="normal" fullWidth error required>
                      <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                      <OutlinedInput
                        name="password"
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleClickShowPassword('showPassword')} edge="end">
                              {values.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        } labelWidth={120} />
                      <FormHelperText>{errorMessage}</FormHelperText>
                    </FormControl>
                  )}

                {!confirmPasswordError ? (
                  <FormControl variant="outlined" margin="normal" fullWidth required>
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      name="confirmPassword"
                      id="outlined-adornment-password"
                      type={values.showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={handleChange}
                      minLength="6"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleClickShowPassword('showConfirmPassword')} edge="end">
                            {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      } labelWidth={145} />
                  </FormControl>
                ) : (
                    <FormControl variant="outlined" margin="normal" fullWidth error required>
                      <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                      <OutlinedInput
                        name="confirmPassword"
                        id="outlined-adornment-password"
                        type={values.showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={handleChange}
                        minLength="6"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleClickShowPassword('showConfirmPassword')} edge="end">
                              {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        } labelWidth={145} />
                      <FormHelperText>{errorMessage}</FormHelperText>
                    </FormControl>
                  )}

                <br /> <br />
                <Button type="submit" variant="contained" className={classes.buttonColor} size="large">
                  Reset
                </Button>
              </form>

            </Paper>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default Reset;