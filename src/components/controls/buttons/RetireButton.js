import { Button, makeStyles, withStyles } from "@material-ui/core";

import AlarmOffIcon from "@material-ui/icons/AlarmOff";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
import { yellow } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: yellow[700],
    "&:hover": {
      backgroundColor: yellow[50],
    },
  },
}))(Button);

export default function RetireButton(props) {
  const { onClick, retired, ...other } = props;
  const text = retired ? "Un - Retire" : "Retire";
  const icon = retired ? <AlarmOnIcon /> : <AlarmOffIcon />;

  return (
    <ColorButton
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={icon}
      onClick={onClick}
      {...other}
    >
      {text}
    </ColorButton>
  );
}
