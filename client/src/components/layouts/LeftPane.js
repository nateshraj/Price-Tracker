import React from 'react'
import { Grid  } from '@material-ui/core'
import Type from './layouts/Type';



const qwe = () => {
  
  

  return (

    <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh' }} className={classes.bgColor} >
      <Grid item sm={6}>
        <Type />
      </Grid>


    </Grid>
  )
}

export default qwe;
