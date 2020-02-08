import React from 'react'
import TypeIt from 'typeit';
import { Typography, Grid } from '@material-ui/core'

class Type extends React.Component {

  componentDidMount() {
    new TypeIt(this.el).go();
  }

  render() {
    return (
      <Grid item sm={6}>
        <Typography variant="h2" gutterBottom ref={(el) => { this.el = el; }}>Track prices of your favourite products on <b>Amazon</b> and <b>Flipkart.</b></Typography>
      </Grid>
    );
  }
}

export default Type;