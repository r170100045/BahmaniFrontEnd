import { Button, makeStyles, withStyles } from '@material-ui/core';

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import { yellow } from '@material-ui/core/colors';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(yellow[100]),
    backgroundColor: yellow[100],
    '&:hover': {
      backgroundColor: yellow[50],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function RetireButton(props) {
  const classes = useStyles();
  const { onClick, retired, ...other } = props;
  const text = retired ? 'Un - Retire' : 'Retire';
  const icon = retired ? <AlarmOnIcon /> : <AlarmOffIcon />;

  return (
    <ColorButton
      variant="contained"
      color="primary"
      size="medium"
      startIcon={icon}
      className={classes.margin}
      onClick={onClick}
      {...other}
    >
      {text}
    </ColorButton>
  );
}
