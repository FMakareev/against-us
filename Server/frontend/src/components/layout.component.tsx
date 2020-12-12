import * as React from 'react';
import { Container } from '@material-ui/core';

export const Layout = ({ children }: any) => {
  return <Container maxWidth="sm">
    {children}
  </Container>;

};
