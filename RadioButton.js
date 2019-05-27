import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    
  },
  formControl: {
    margin: theme.spacing(0),
    
  },
  group: {
    margin: theme.spacing(0, 0),
    width: 0, height: 25,
  },
}));

const RadioButtonsGroup = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <strong>Type:</strong>
        <RadioGroup
          aria-label="Gender"
          name="gender1"
          className={classes.group}
          value={props.value}
          onChange={(event)=>{ handleChange(event); props.handleSelected(event) }}
        >
          <FormControlLabel value='GA' control={<Radio color="primary"/>} label="GA" />
          <FormControlLabel value='pilot' control={<Radio  color="primary"/>} label="Pilot" />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default RadioButtonsGroup;