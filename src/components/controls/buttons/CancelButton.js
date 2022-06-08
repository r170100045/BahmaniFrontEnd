import { Button, makeStyles, withStyles } from "@material-ui/core";

import CancelIcon from "@material-ui/icons/Cancel";
import { yellow } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: yellow[700],
    marginTop: 10,

    "&:hover": {
      backgroundColor: yellow[50],
    },
  },
}))(Button);

export default function CancelButton(props) {
  const { onClick, entityName, ...other } = props;

  return (
    <ColorButton
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={<CancelIcon />}
      onClick={onClick}
      {...other}
    >
      Cancel
    </ColorButton>
  );
}
