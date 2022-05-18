import { Button, makeStyles, withStyles } from "@material-ui/core";

import CancelIcon from "@material-ui/icons/Cancel";
import { yellow } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: yellow[700],
    "&:hover": {
      backgroundColor: yellow[50],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function CancelButton(props) {
  const classes = useStyles();
  const { onClick, entityName, ...other } = props;

  return (
    <ColorButton
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={<CancelIcon />}
      className={classes.margin}
      onClick={onClick}
      {...other}
    >
      Cancel
    </ColorButton>
  );
}
