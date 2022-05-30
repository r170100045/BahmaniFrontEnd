import { Button, Paper, makeStyles, withStyles } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import { red } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: red[700],
    backgroundColor: red[50],
    "&:hover": {
      backgroundColor: "white",
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
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={<DeleteIcon />}
      className={classes.margin}
      {...other}
      onClick={onClick}
    >
      Delete Forever
    </ColorButton>
  );
}
