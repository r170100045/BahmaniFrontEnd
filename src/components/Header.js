import { AppBar, Grid, Toolbar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#cad3ab",
    width: "100%",
  },
});

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar
      position="static"
      className={classes.root}
      style={{ height: "10vh" }}
    >
      <Toolbar>
        <Grid container>
          <Grid item></Grid>
          <Grid item></Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
