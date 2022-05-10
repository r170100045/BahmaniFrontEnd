import AddIcon from "@material-ui/icons/Add";
import { Button, makeStyles, withStyles } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue["A700"]),
    backgroundColor: blue["A700"],
    "&:hover": {
      backgroundColor: blue[900]
    }
  }
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function AddButton(props) {
  const classes = useStyles();
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<AddIcon />}
      className={classes.margin}
      onClick={onClick}
      {...other}
    >
      Add New
    </ColorButton>
  );
}
