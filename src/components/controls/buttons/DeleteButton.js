import DeleteIcon from "@material-ui/icons/Delete";
import { Button, makeStyles, withStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red["A700"]),
    backgroundColor: red["A700"],
    "&:hover": {
      backgroundColor: red[700]
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
      startIcon={<DeleteIcon />}
      className={classes.margin}
      {...other}
      onClick={onClick}
    >
      Delete
    </ColorButton>
  );
}
