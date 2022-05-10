import React, { useState } from "react";
import { Paper, makeStyles } from "@material-ui/core";

export function useForm(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    // if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1)
    }
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  }
}));

export function Form(props) {
  const classes = useStyles();
  const { children, disabled, ...other } = props;
  return (
    <Paper className={classes.pageContent}>
      <form className={classes.root} autoComplete="off" {...other}>
        {props.children}
      </form>
    </Paper>
  );
}
