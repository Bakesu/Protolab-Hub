import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FC } from 'react';


interface Props {
}

const Navbar:FC<Props> = (props) => {


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ background: '#1565c0' }}>
        <Toolbar>
          <Typography align="left" variant="h4" component="div" sx={{ flexGrow: 1 }} >
            Protolab Hub
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
