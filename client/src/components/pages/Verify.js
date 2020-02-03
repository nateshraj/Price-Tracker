import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Appbar';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Verify = (props) => {
  const { verificationToken } = useParams();

  const [text, setText] = useState('');

  const verifyEmail = async () => {
    try {
      const res = await axios.get(`/api/verify/${verificationToken}`);
      setText(res.data);
      setTimeout(() => props.history.push('/login'), 5000);
    } catch (e) {
      e.response.data ? setText(e.response.data) : setText('Unable to verify email, please try again later. If you are facing issues, write to nateshrajs@gmail.com');
    }
  }

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <Navbar />
      <br /><br />
      <Typography gutterBottom variant="h4" align="center" >
        {text}
      </Typography>
    </React.Fragment>
  );
}

export default Verify;