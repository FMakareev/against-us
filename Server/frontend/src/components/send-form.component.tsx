import * as React from 'react';
import { Button, InputBase, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '20px',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));
type Props = {
  value: any;
  onSubmit: any;
  onChange: any;
  buttonLabel?: string;
  placeholder?: string;
}
export const SendForm = (
  {
    onChange,
    onSubmit,
    value,
    buttonLabel = 'send',
    placeholder="Input message"
  }: Props,
) => {
  const classes = useStyles();
  return <Paper component="form" className={classes.root}>
    <InputBase
      className={classes.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <Button onClick={onSubmit} type="button" className={classes.iconButton}>
      {buttonLabel}
    </Button>
  </Paper>;
};
