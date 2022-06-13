import { Button, withStyles } from "@material-ui/core";

import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { yellow } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(yellow[100]),
    backgroundColor: yellow[100],
    "&:hover": {
      backgroundColor: yellow[50],
    },
  },
}))(Button);

export default function DeleteButton(props) {
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<RotateLeftIcon />}
      onClick={onClick}
      {...other}
    >
      Reset
    </ColorButton>
  );
}
