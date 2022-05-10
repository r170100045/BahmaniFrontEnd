import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { Button, makeStyles, withStyles } from "@material-ui/core";
import { yellow } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(yellow[100]),
    backgroundColor: yellow[100],
    "&:hover": {
      backgroundColor: yellow[50]
    }
  }
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function DeleteButton(props) {
  const classes = useStyles();
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<RotateLeftIcon />}
      className={classes.margin}
      onClick={onClick}
      {...other}
    >
      Reset
    </ColorButton>
  );
}
