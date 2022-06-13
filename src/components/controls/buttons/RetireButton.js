import { Button, withStyles } from "@material-ui/core";

import AlarmOffIcon from "@material-ui/icons/AlarmOff";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
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

export default function RetireButton(props) {
  const { onClick, retired, disabled, ...other } = props;
  let text = "";
  if (typeof retired == "boolean") {
    text = retired ? "Un - Retire" : "Retire";
  }
  if (typeof disabled == "boolean") {
    text = disabled ? "Enable" : "Disable";
  }
  const icon = retired || disabled ? <AlarmOnIcon /> : <AlarmOffIcon />;

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
