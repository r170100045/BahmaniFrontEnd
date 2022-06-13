import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { FORMAT_OPTIONS, GET_VALUE } from "../../constants/otherConstants";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  checkboxLabelStyle,
  deleteButtonStyle,
  globalError,
  inputInfoStyle,
  inputStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import {
  deletePersonAttributeTypeById,
  getPersonAttributeTypeById,
  insertPersonAttributeType,
  updatePersonAttributeTypeById,
} from "../../services/personAttributeTypeService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import { SingleSelect } from "react-select-material-ui";
import SuccessMessage from "../../utils/SuccessMessage";
import { getPrivileges } from "../../services/privilegeService";

class PersonAttributeTypeForm extends React.Component {
  constructor(props) {
    super(props);

    const initialPersonAttributeType = {
      name: null,
      description: null,
      editPrivilege: null,
      foreignKey: null,
      format: null,
      retireReason: null,
      retired: false,
      searchable: false,
    };

    this.state = {
      personAttributeType: initialPersonAttributeType,
      personAttributeTypeId: this.props.match.params.id,
      editPrivilegeOptions: [],
      redirect: null,
      isLoading: true,
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        name: "name can not be empty",
        nameHasError: false,
        format: "format can not be empty",
        formatHasError: false,
        retireReason: "reason to retire can not be empty",
        retireReasonHasError: false,
      },
    };

    this.viewAll = "/personAttributeType/view/all";

    this.savePersonAttributeType = this.savePersonAttributeType.bind(this);
    this.retirePersonAttributeType = this.retirePersonAttributeType.bind(this);
    this.unretirePersonAttributeType =
      this.unretirePersonAttributeType.bind(this);
    this.cancelPersonAttributeType = this.cancelPersonAttributeType.bind(this);
    this.deletePersonAttributeType = this.deletePersonAttributeType.bind(this);
    this.personAttributeTypeChangeHandler =
      this.personAttributeTypeChangeHandler.bind(this);
    this.personAttributeTypeSelectTypeInputChangeHandler =
      this.personAttributeTypeSelectTypeInputChangeHandler.bind(this);
  }

  // error validation starts
  setHttpError(apiName, eMessage) {
    const { errors } = this.state;
    errors.httpRequestHasError = true;
    errors.httpRequest = "error: " + apiName + " api call failed : " + eMessage;
    this.setState({ errors }, () => {
      setTimeout(
        function () {
          this.setState({ redirect: this.viewAll });
        }.bind(this),
        4000
      );
    });
  }

  nonEmpty(object) {
    return object && object.trim().length > 0;
  }

  resetErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.nameHasError = false;
      errors.formatHasError = false;
      errors.retireReasonHasError = false;
      this.setState({ errors, error: false }, () => resolve());
    });
  }

  successAndRedirect(successMessage) {
    this.setState({ showSuccessMessage: true, successMessage }, () => {
      setTimeout(
        function () {
          this.setState({ redirect: this.viewAll });
        }.bind(this),
        500
      );
    });
  }

  validate(personAttributeType) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        if (!this.nonEmpty(personAttributeType.name)) {
          error = true;
          errors.nameHasError = true;
        }

        if (!this.nonEmpty(personAttributeType.format)) {
          error = true;
          errors.formatHasError = true;
        }

        if (personAttributeType.retired) {
          if (!this.nonEmpty(personAttributeType.retireReason)) {
            error = true;
            errors.retireReasonHasError = true;
            personAttributeType.retired = false;
          }
        }

        this.setState({ error, errors, personAttributeType }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // component mount starts
  componentDidMount() {
    this.setEditPrivilegeOptions()
      .then(() => this.setFetchedPersonAttributeType())
      .then(() => this.setState({ isLoading: false }));
  }

  setEditPrivilegeOptions() {
    return new Promise((resolve, reject) => {
      getPrivileges()
        .then((response) => {
          const editPrivilegeOptions = [];
          Object.keys(response.data).forEach((key) => {
            editPrivilegeOptions.push({
              label: response.data[key].privilege,
              value: response.data[key].privilege,
            });
          });
          this.setState({ editPrivilegeOptions }, () => {
            resolve();
          });
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getPrivileges", error.message);
        });
    });
  }

  setFetchedPersonAttributeType() {
    return new Promise((resolve, reject) => {
      const { personAttributeTypeId } = this.state;

      if (personAttributeTypeId !== "add") {
        getPersonAttributeTypeById(personAttributeTypeId)
          .then((response) => {
            console.log(response.data);
            this.setState({ personAttributeType: response.data }, () =>
              resolve()
            );
          })
          .catch((error) => {
            console.log(error);
            this.setHttpError("getPersonAttributeTypeById", error.message);
          });
      } else {
        resolve();
      }
    });
  }
  // component mount ends

  // save starts
  savePersonAttributeType(successMessage = "Updated") {
    const { personAttributeTypeId, personAttributeType } = this.state;

    this.validate(personAttributeType).then(() => {
      const { error } = this.state;
      if (!error) {
        if (personAttributeTypeId === "add")
          this.insertPersonAttributeTypeWithData(personAttributeType);
        else
          this.updatePersonAttributeTypeWithData(
            personAttributeTypeId,
            personAttributeType,
            successMessage
          );
      }
    });
  }

  insertPersonAttributeTypeWithData(personAttributeType) {
    insertPersonAttributeType(personAttributeType)
      .then(() => {
        this.successAndRedirect("Saved");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertPersonAttributeType", error.message);
      });
  }

  updatePersonAttributeTypeWithData(
    personAttributeTypeId,
    personAttributeType,
    successMessage
  ) {
    updatePersonAttributeTypeById(personAttributeTypeId, personAttributeType)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("updateVisitTypeById", error.message);
      });
  }
  // save ends

  retirePersonAttributeType() {
    const { personAttributeType } = this.state;
    personAttributeType.retired = true;
    this.setState({ personAttributeType }, () => {
      this.savePersonAttributeType("Retired");
    });
  }

  unretirePersonAttributeType() {
    const { personAttributeType } = this.state;
    personAttributeType.retireReason = null;
    personAttributeType.retired = false;
    this.setState({ personAttributeType }, () => {
      this.savePersonAttributeType("Un-Retired");
    });
  }

  cancelPersonAttributeType() {
    this.setState({ redirect: this.viewAll });
  }

  deletePersonAttributeType() {
    const { personAttributeTypeId } = this.state;
    deletePersonAttributeTypeById(personAttributeTypeId)
      .then(() => {
        this.successAndRedirect("Deleted");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deletePersonAttributeTypeById", error.message);
      });
  }

  // input change handlers
  personAttributeTypeChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { personAttributeType } = this.state;
    personAttributeType[name] = event.target[type];
    this.setState({ personAttributeType });
  };

  personAttributeTypeSelectTypeInputChangeHandler(selectedValue, name) {
    const { personAttributeType } = this.state;
    personAttributeType[name] = selectedValue;
    this.setState({ personAttributeType });
  }

  render() {
    const {
      savePersonAttributeType,
      retirePersonAttributeType,
      unretirePersonAttributeType,
      cancelPersonAttributeType,
      deletePersonAttributeType,
      personAttributeTypeChangeHandler,
      personAttributeTypeSelectTypeInputChangeHandler,
    } = this;

    const {
      personAttributeType,
      personAttributeTypeId,
      editPrivilegeOptions,
      redirect,
      isLoading,
      error,
      errors,
      showSuccessMessage,
      successMessage,
    } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (showSuccessMessage) return <SuccessMessage action={successMessage} />;

    if (errors.httpRequestHasError)
      return <ErrorLoadingData message={errors.httpRequest} />;

    if (isLoading) return <LoadingData />;

    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          {error && (
            <span style={globalError}>{errors.globalErrorMessage}</span>
          )}

          <TextField
            error={errors.nameHasError}
            helperText={errors.nameHasError && errors.name}
            style={inputStyle}
            label="Name"
            type="text"
            id="name"
            name="name"
            value={GET_VALUE(personAttributeType.name)}
            onChange={personAttributeTypeChangeHandler}
            required
          />

          <SingleSelect
            error={errors.formatHasError}
            helperText={errors.formatHasError && errors.format}
            label="Format"
            style={inputStyle}
            id="format"
            name="format"
            defaultValue={personAttributeType.format}
            onChange={(selectedValue) =>
              personAttributeTypeSelectTypeInputChangeHandler(
                selectedValue,
                "format"
              )
            }
            options={FORMAT_OPTIONS}
            required
          />
          <span style={inputInfoStyle}>Name of a Java or OpenMRS class</span>

          <TextField
            style={inputStyle}
            label="Foreign Key"
            type="text"
            id="foreignKey"
            name="foreignKey"
            value={GET_VALUE(personAttributeType.foreignKey)}
            onChange={(e) => personAttributeTypeChangeHandler(e)}
          />
          <span style={inputInfoStyle}>
            Integer id of the object specified by 'format'
          </span>

          <FormControlLabel
            control={
              <Checkbox
                type="checkbox"
                id="searchable"
                name="searchable"
                onChange={(e) => personAttributeTypeChangeHandler(e, "checked")}
                checked={GET_VALUE(personAttributeType.searchable)}
              />
            }
            label={<span style={checkboxLabelStyle}>Searchable</span>}
          />
          <span style={inputInfoStyle}>
            Whether this type can be searched on or not
          </span>

          <TextField
            label="Description"
            id="description"
            name="description"
            rows="3"
            cols="20"
            multiline
            style={inputStyle}
            value={GET_VALUE(personAttributeType.description)}
            onChange={(e) => personAttributeTypeChangeHandler(e)}
          />

          <SingleSelect
            label="Edit Privilege"
            style={inputStyle}
            id="editPrivilege"
            name="editPrivilege"
            defaultValue={GET_VALUE(personAttributeType.editPrivilege)}
            onChange={(selectedValue) =>
              personAttributeTypeSelectTypeInputChangeHandler(
                selectedValue,
                "editPrivilege"
              )
            }
            options={editPrivilegeOptions}
          />
          <span style={inputInfoStyle}>
            The privilege needed by a user to edit this person attribute
          </span>

          <Grid container style={{ gridGap: 5, marginTop: 20 }}>
            <Controls.SaveButton onClick={() => savePersonAttributeType()} />
            <Controls.CancelButton
              onClick={() => cancelPersonAttributeType()}
            />
          </Grid>
        </Paper>

        {personAttributeTypeId !== "add" && !personAttributeType.retired && (
          <Paper style={paperStyle}>
            <TextField
              error={errors.retireReasonHasError}
              helperText={errors.retireReasonHasError && errors.retireReason}
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              value={GET_VALUE(personAttributeType.retireReason)}
              onChange={(e) => personAttributeTypeChangeHandler(e)}
              required
            />

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={personAttributeType.retired}
                onClick={() => retirePersonAttributeType()}
              />
            </div>
          </Paper>
        )}
        {personAttributeTypeId !== "add" && personAttributeType.retired && (
          <Paper style={paperStyle}>
            <p style={subHeadingStyle}>Unretire Person Attribute Type</p>

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={personAttributeType.retired}
                onClick={() => unretirePersonAttributeType()}
              />
            </div>
          </Paper>
        )}

        {personAttributeTypeId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deletePersonAttributeType()}
          />
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(PersonAttributeTypeForm);
