import { FORMAT_OPTIONS, GET_VALUE } from "../../constants/otherConstants";
import { Input, Paper, TextField } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
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

import React from "react";
import Select from "react-select";
import { SingleSelect } from "react-select-material-ui";
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
      redirect: null,
      isLoading: true,
      editPrivilegeOptions: [],
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.selectTypeInputChangeHandler =
      this.selectTypeInputChangeHandler.bind(this);
  }

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
            resolve("success");
          });
        })
        .catch((e) => reject(e));
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
          .catch((e) => reject(e));
      } else {
        resolve();
      }
    });
  }

  savePersonAttributeType() {
    const { personAttributeTypeId, personAttributeType } = this.state;

    if (personAttributeTypeId === "add")
      this.insertPersonAttributeTypeWithData(personAttributeType);
    else
      this.updatePersonAttributeTypeWithData(
        personAttributeTypeId,
        personAttributeType
      );
  }

  insertPersonAttributeTypeWithData(personAttributeType) {
    insertPersonAttributeType(personAttributeType)
      .then(() => {
        this.setState({ redirect: "/personAttributeType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updatePersonAttributeTypeWithData(
    personAttributeTypeId,
    personAttributeType
  ) {
    updatePersonAttributeTypeById(personAttributeTypeId, personAttributeType)
      .then(() => {
        this.setState({ redirect: "/personAttributeType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  retirePersonAttributeType() {
    const { personAttributeTypeId, personAttributeType } = this.state;
    personAttributeType.retired = true;
    this.setState({ personAttributeType }, () => {
      this.updatePersonAttributeTypeWithData(
        personAttributeTypeId,
        personAttributeType
      );
    });
  }

  unretirePersonAttributeType() {
    const { personAttributeTypeId, personAttributeType } = this.state;
    personAttributeType.retireReason = "";
    personAttributeType.retired = false;
    this.setState({ personAttributeType }, () => {
      this.updatePersonAttributeTypeWithData(
        personAttributeTypeId,
        personAttributeType
      );
    });
  }

  deletePersonAttributeType() {
    const { personAttributeTypeId } = this.state;
    deletePersonAttributeTypeById(personAttributeTypeId)
      .then(() => {
        this.setState({ redirect: "/personAttributeType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // selectTypeInputChangeHandler(selectedOption, name) {
  //   const { personAttributeType } = this.state;
  //   personAttributeType[name] = selectedOption.value;
  //   this.setState({ personAttributeType });
  // }
  selectTypeInputChangeHandler(value, name) {
    const { personAttributeType } = this.state;
    personAttributeType[name] = value;
    this.setState({ personAttributeType });
  }

  formatChangeHandler(selectedOption) {
    const { personAttributeType } = this.state;
    personAttributeType.format = selectedOption.value;
    this.setState({ personAttributeType });
  }

  editPrivilegeChangeHandler(selectedOption) {
    const { personAttributeType } = this.state;
    personAttributeType.editPrivilege = selectedOption.value;
    this.setState({ personAttributeType });
  }

  inputChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { personAttributeType } = this.state;
    personAttributeType[name] = event.target[type];
    this.setState({ personAttributeType });
  };

  cancelPersonAttributeType() {
    this.setState({ redirect: "/personAttributeType/view/all" });
  }

  render() {
    const {
      inputChangeHandler,
      savePersonAttributeType,
      retirePersonAttributeType,
      unretirePersonAttributeType,
      deletePersonAttributeType,
      cancelPersonAttributeType,
      selectTypeInputChangeHandler,
      editPrivilegeChangeHandler,
    } = this;

    const {
      personAttributeType,
      personAttributeTypeId,
      redirect,
      isLoading,
      editPrivilegeOptions,
    } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <p>Loading...</p>;

    const getDefaultFormatValue = FORMAT_OPTIONS.filter(
      (option) => option.value === personAttributeType.format
    );

    const getDefaultEditPrivilegeValue = editPrivilegeOptions.filter(
      (option) => option.value === personAttributeType.editPrivilege
    );

    if (!isLoading || personAttributeTypeId === "add") {
      return (
        <React.Fragment>
          <Paper style={paperStyle}>
            <TextField
              style={inputStyle}
              label="Name"
              type="text"
              id="name"
              name="name"
              value={GET_VALUE(personAttributeType.name)}
              onChange={inputChangeHandler}
            />
            <br />

            {/* <label htmlFor="format" style={inputStyle}>
              Format:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  style={inputStyle}
                  id="format"
                  name="format"
                  defaultValue={getDefaultFormatValue}
                  onChange={(selectedOption) =>
                    selectTypeInputChangeHandler(selectedOption, "format")
                  }
                  options={FORMAT_OPTIONS}
                />
              </div>
            </label>
            <br /> */}
            <SingleSelect
              label="Format"
              style={inputStyle}
              id="format"
              name="format"
              defaultValue={getDefaultFormatValue}
              onChange={(value) =>
                selectTypeInputChangeHandler(value, "format")
              }
              options={FORMAT_OPTIONS}
            />
            <br />

            <label htmlFor="editPrivilege" style={inputStyle}>
              Edit Privilege:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  style={inputStyle}
                  id="editPrivilege"
                  name="editPrivilege"
                  defaultValue={getDefaultEditPrivilegeValue}
                  onChange={(selectedOption) =>
                    editPrivilegeChangeHandler(selectedOption, "editPrivilege")
                  }
                  options={editPrivilegeOptions}
                />
              </div>
            </label>
            <br />

            <label htmlFor="searchable" style={inputStyle}>
              Searchable:
              <input
                style={inputStyle}
                type="checkbox"
                id="searchable"
                name="searchable"
                onChange={(e) => inputChangeHandler(e, "checked")}
                checked={GET_VALUE(personAttributeType.searchable)}
              />
            </label>
            <br />

            <TextField
              label="Description"
              id="description"
              name="description"
              rows="3"
              cols="20"
              multiline
              style={inputStyle}
              value={GET_VALUE(personAttributeType.description)}
              onChange={inputChangeHandler}
            />
            <br />
            <br />

            {/* SELECT -- Edit Privilege */}
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={savePersonAttributeType.bind(this)}
              >
                Save Person Attribute Type
              </button>
              <button
                type="button"
                onClick={cancelPersonAttributeType.bind(this)}
              >
                Cancel
              </button>
            </div>

            <br />
          </Paper>
          {personAttributeTypeId !== "add" && !personAttributeType.retired && (
            <Paper style={paperStyle}>
              <hr />

              <p style={subHeadingStyle}>Retire Person Attribute Type</p>

              <TextField
                style={inputStyle}
                label="Reason"
                type="text"
                id="retireReason"
                name="retireReason"
                value={GET_VALUE(personAttributeType.retireReason)}
                onChange={inputChangeHandler}
              />
              <br />
              <div style={buttonGroupStyle}>
                <button
                  type="button"
                  onClick={retirePersonAttributeType.bind(this)}
                >
                  Retire Person Attribute Type
                </button>
              </div>

              <br />
            </Paper>
          )}
          {personAttributeTypeId !== "add" && personAttributeType.retired && (
            <Paper style={paperStyle}>
              <hr />

              <p style={subHeadingStyle}>Unretire Person Attribute Type</p>

              <div style={buttonGroupStyle}>
                <button
                  type="button"
                  onClick={unretirePersonAttributeType.bind(this)}
                >
                  Unretire Person Attribute Type
                </button>
              </div>

              <br />
            </Paper>
          )}

          {personAttributeTypeId !== "add" && (
            <Paper style={paperStyle}>
              <hr />

              <p style={subHeadingStyle}>
                Delete Person Attribute Type Forever
              </p>
              <div style={buttonGroupStyle}>
                <button
                  type="button"
                  onClick={deletePersonAttributeType.bind(this)}
                >
                  Delete Person Attribute Type Forever
                </button>
              </div>
            </Paper>
          )}
        </React.Fragment>
      );
    }
  }
}
export default withRouter(PersonAttributeTypeForm);
