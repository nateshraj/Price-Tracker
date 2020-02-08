import React from 'react';
import Type from '../layouts/Type';
import Login from '../Login';
import { Grid } from '@material-ui/core';
import Register from '../Register';
import Navbar from '../layouts/Appbar';

const Landing = (props) => {

  return (
    <React.Fragment>
      <Navbar />
      <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#EEEEEE' }} >
        <Type />
        {props.componentToLoad === 'register' ? <Register {...props} /> : <Login {...props} />}
      </Grid>
    </React.Fragment>
  );
}

export default Landing;