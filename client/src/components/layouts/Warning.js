import React from 'react'
import { Alert } from '@material-ui/lab'
import { Container, Link, Typography } from '@material-ui/core';
import axios from 'axios';

const Warning = () => {

  const resendEmail = async () => {
    await axios.get('/api/verify/resend');
  }

  return (
    <Container>
      <Alert severity="error" >
        <Typography variant="body1">
          Please verify your email to add products. &nbsp;
          <Link href='#' onClick={resendEmail}>
            Click here
          </Link>
          &nbsp; to resend the verification mail.
        </Typography>
      </Alert>
    </Container>
  )
}

export default Warning;