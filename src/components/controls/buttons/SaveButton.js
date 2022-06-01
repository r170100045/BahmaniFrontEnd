import { Button, makeStyles, withStyles } from "@material-ui/core";

import SaveIcon from "@material-ui/icons/Save";
import { green } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: green[700],
    "&:hover": {
      backgroundColor: green[50],
    },
  },
}))(Button);

// const useStyles = makeStyles((theme) => ({
//   margin: {
//     margin: theme.spacing(0),
//   },
// }));

export default function SaveButton(props) {
  // const classes = useStyles();
  const { onClick, ...other } = props;

  return (
    <ColorButton
      variant="outlined"
      color="primary"
      size="medium"
      startIcon={<SaveIcon />}
      // className={classes.margin}
      onClick={onClick}
      {...other}
    >
      Save
    </ColorButton>
  );
}
