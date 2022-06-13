import { Button, withStyles } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import { blue } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: blue[700],
    "&:hover": {
      backgroundColor: blue[50],
    },
  },
}))(Button);

export default function AddButton(props) {
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={<AddIcon />}
      onClick={onClick}
      {...other}
    >
      Add New
    </ColorButton>
  );
}
