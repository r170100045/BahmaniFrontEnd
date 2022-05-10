import { Button, makeStyles, withStyles } from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green['A700']),
    backgroundColor: green['A700'],
    '&:hover': {
      backgroundColor: green[300],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function DeleteButton(props) {
  const classes = useStyles();
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<SaveIcon />}
      className={classes.margin}
      onClick={onClick}
      {...other}
    >
      Save
    </ColorButton>
  );
}
