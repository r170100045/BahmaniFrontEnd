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
    margin: theme.spacing(0, 0, 2, 0),
  },
}))(Button);

export default function DeleteButton(props) {
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={<DeleteIcon />}
      {...other}
      onClick={onClick}
    >
      Delete Forever
    </ColorButton>
  );
}
