import React, { useEffect, useContext, useState } from 'react'
import { Grid, makeStyles, Paper, TextField, Button, OutlinedInput, FormControl, InputLabel, InputAdornment, IconButton, FormHelperText, Typography, Link, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { AuthContext } from '../context/auth/AuthContext';
import axios from 'axios';

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
  },
  link: {
    textAlign: 'left'
  }
}));

const Login = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
    userError: false,
    passwordError: false,
    errorMessage: '',
    dialogOpen: false,
    resetEmail: ''
  });

  const authContext = useContext(AuthContext);
  const { login, error, isAuthenticated, loadUser } = authContext;

  useEffect(() => {
    loadUser();
    if (isAuthenticated) {
      props.history.push('/products');
    }
    if (error === 'Email does not exist') {
      setValues({ ...values, passwordError: false, userError: true, errorMessage: error });
    } else if (error === 'Invalid credentials') {
      setValues({ ...values, passwordError: true, userError: false, errorMessage: error });
    } // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const { email, password, userError, passwordError, errorMessage, dialogOpen, resetEmail } = values;

  const toggleDialog = () => setValues({ ...values, dialogOpen: !values.dialogOpen, resetEmail: '' });

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleClickShowPassword = (prop) => setValues({ ...values, [prop]: !values[prop] });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  }

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      }
      await axios.post('/api/reset-email', { resetEmail }, config);
      toggleDialog();
    } catch (e) {
      toggleDialog();
    }
  }

  return (
    <Grid item sm={3}>
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>

          {!userError ? (
            <TextField id="outlined-full-width" label="Email" fullWidth variant="outlined" margin="normal" name="email" value={email} onChange={handleChange} type="email" required />
          ) : (
              <TextField error id="outlined-full-width" label="Email" fullWidth variant="outlined" margin="normal" name="email" value={email} onChange={handleChange} type="email" helperText={errorMessage} required />
            )}

          {!passwordError ? (
            <FormControl variant="outlined" margin="normal" fullWidth required >
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
                } labelWidth={85} />
            </FormControl>
          ) : (
              <FormControl variant="outlined" margin="normal" fullWidth error>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  name="password"
                  id="outlined-adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleClickShowPassword('showPassword')} edge="end">
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  } labelWidth={85} />
                <FormHelperText>{errorMessage}</FormHelperText>
              </FormControl>
            )}
          <Typography className={classes.link}>
            <Link href="#" color="inherit" onClick={toggleDialog}>
              Forgot password?
            </Link>
          </Typography>

          <br />
          <Button type="submit" variant="contained" className={classes.buttonColor} size="large">
            Login
          </Button>
        </form>
        <Dialog open={dialogOpen} onClose={toggleDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your Email to reset your password.
            </DialogContentText>
            <form id="resetForm" onSubmit={handleReset}>
              <TextField id="outlined-full-width" autoFocus label="Email" fullWidth variant="outlined" margin="normal" name="resetEmail" value={resetEmail} onChange={handleChange} type="email" required />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialog} color="primary">
              Cancel
            </Button>
            <Button type="submit" form="resetForm" color="primary">
              Reset
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Grid>
  )
}

export default Login;