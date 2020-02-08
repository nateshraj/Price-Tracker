import React, { useContext, useEffect } from 'react';
import { Grid, makeStyles, Paper, TextField, Button, OutlinedInput, FormControl, InputLabel, InputAdornment, IconButton, FormHelperText } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { AuthContext } from '../context/auth/AuthContext';

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

const Register = (props) => {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    userError: false,
    passwordError: false,
    confirmPasswordError: false,
    errorMessage: ''
  });

  const authContext = useContext(AuthContext);
  const { register, error, isAuthenticated, loadUser } = authContext;

  useEffect(() => {
    loadUser();
    if (isAuthenticated) {
      props.history.push('/products');
    }
    if (error === 'Email already exists') {
      setValues({ ...values, passwordError: false, confirmPasswordError: false, userError: true, errorMessage: error });
    } // eslint-disable-next-line
  }, [error, isAuthenticated, props.history])

  const { name, email, password, confirmPassword, userError, passwordError, confirmPasswordError, errorMessage } = values;

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleClickShowPassword = (prop) => setValues({ ...values, [prop]: !values[prop] });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setValues({ ...values, passwordError: true, confirmPasswordError: false, errorMessage: 'Passwords should be atleast 6 characters' });
    } else if (password !== confirmPassword) {
      setValues({ ...values, passwordError: true, confirmPasswordError: true, errorMessage: 'Passwords do not match' });
    } else {
      register({ name, email, password });
    }
  }

  return (
    <Grid item sm={3}>
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <TextField id="outlined-full-width" label="Name" fullWidth variant="outlined" margin="normal" name="name" value={name} onChange={handleChange} required />

          {!userError ? (
            <TextField id="outlined-full-width" label="Email" fullWidth variant="outlined" margin="normal" name="email" value={email} onChange={handleChange} type="email" required />
          ) : (
              <TextField error id="outlined-full-width" label="Email" fullWidth variant="outlined" margin="normal" name="email" value={email} onChange={handleChange} type="email" helperText={errorMessage} required />
            )}

          {!passwordError ? (
            <FormControl variant="outlined" margin="normal" fullWidth required>
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
              <FormControl variant="outlined" margin="normal" fullWidth error required>
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
            Register
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default Register;