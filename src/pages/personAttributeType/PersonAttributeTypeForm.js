import { Redirect, withRouter } from "react-router-dom";
import {
  deletePersonAttributeTypeById,
  getPersonAttributeTypeById,
  insertPersonAttributeType,
  updatePersonAttributeTypeById,
} from "../../services/personAttributeTypeService";

import { FORMAT_OPTIONS } from "../../constants/otherConstants";
import React from "react";
import Select from "react-select";

class PersonAttributeTypeForm extends React.Component {
  constructor(props) {
    super(props);

    const initialPersonAttributeType = {
      name: "",
      description: "",
      editPrevilige: "",
      foreignKey: "",
      format: "",
      retireReason: "",
      retired: false,
      searchable: false,
    };

    this.state = {
      personAttributeType: initialPersonAttributeType,
      personAttributeTypeId: this.props.match.params.id,
      redirect: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    const { personAttributeTypeId } = this.state;
    if (personAttributeTypeId !== "add") {
      getPersonAttributeTypeById(personAttributeTypeId)
        .then((response) => {
          this.setState({
            personAttributeType: response.data,
            isLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  nameChangeHandler(event) {
    const { personAttributeType } = this.state;
    personAttributeType.name = event.target.value;
    this.setState({ personAttributeType });
  }

  descriptionChangeHandler(event) {
    const { personAttributeType } = this.state;
    personAttributeType.description = event.target.value;
    this.setState({ personAttributeType });
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

  retireReasonChangeHandler(event) {
    const { personAttributeType } = this.state;
    personAttributeType.retireReason = event.target.value;
    this.setState({ personAttributeType });
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

  formatChangeHandler(selectedOption) {
    const { personAttributeType } = this.state;
    personAttributeType.format = selectedOption.value;
    this.setState({ personAttributeType });
  }

  searchableChangeHandler(event) {
    const { personAttributeType } = this.state;
    personAttributeType.searchable = event.target.checked;
    this.setState({ personAttributeType });
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  render() {
    const { personAttributeType, personAttributeTypeId, redirect, isLoading } =
      this.state;

    const {
      nameChangeHandler,
      descriptionChangeHandler,
      savePersonAttributeType,
      retireReasonChangeHandler,
      retirePersonAttributeType,
      unretirePersonAttributeType,
      deletePersonAttributeType,
      formatChangeHandler,
      searchableChangeHandler,
      getValueFor,
    } = this;

    if (redirect) return <Redirect to={redirect} />;

    const getDefaultFormatValue = FORMAT_OPTIONS.filter(
      (option) => option.value === personAttributeType.format
    );

    if (!isLoading || personAttributeTypeId === "add") {
      return (
        <React.Fragment>
          <div>
            <label htmlFor="name">
              Name:
              <input
                type="text"
                id="name"
                name="name"
                value={getValueFor(personAttributeType.name)}
                onChange={nameChangeHandler.bind(this)}
              />
            </label>
            <br />

            <label htmlFor="format">
              Format:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  id="format"
                  name="format"
                  defaultValue={getDefaultFormatValue}
                  onChange={formatChangeHandler.bind(this)}
                  options={FORMAT_OPTIONS}
                />
              </div>
            </label>
            <br />

            <label htmlFor="editPrivilege">
              Edit Privilege:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  id="editPrivilege"
                  name="editPrivilege"
                  defaultValue={getDefaultEditPrivilegeValue}
                  onChange={editPrivilegeChangeHandler.bind(this)}
                  options={EDIT_PRIVILEGE_OPTIONS}
                />
              </div>
            </label>
            <br />

            <label htmlFor="searchable">
              Searchable:
              <input
                type="checkbox"
                id="searchable"
                name="searchable"
                onChange={searchableChangeHandler.bind(this)}
                checked={getValueFor(personAttributeType.searchable)}
              />
            </label>
            <br />

            <label htmlFor="description">
              Description:
              <textarea
                id="description"
                name="description"
                rows="3"
                cols="20"
                value={getValueFor(personAttributeType.description)}
                onChange={descriptionChangeHandler.bind(this)}
              />
            </label>
            <br />

            {/* SELECT -- Edit Privilege */}

            <button type="button" onClick={savePersonAttributeType.bind(this)}>
              Save Person Attribute Type
            </button>
            <br />
          </div>

          {personAttributeTypeId !== "add" && !personAttributeType.retired && (
            <div>
              <hr />

              <p>Retire Person Attribute Type</p>

              <label htmlFor="retireReason">
                Reason:
                <input
                  type="text"
                  id="retireReason"
                  name="retireReason"
                  value={getValueFor(personAttributeType.retireReason)}
                  onChange={retireReasonChangeHandler.bind(this)}
                />
              </label>
              <br />

              <button
                type="button"
                onClick={retirePersonAttributeType.bind(this)}
              >
                Retire Person Attribute Type
              </button>
              <br />
            </div>
          )}

          {personAttributeTypeId !== "add" && personAttributeType.retired && (
            <div>
              <hr />

              <p>Unretire Person Attribute Type</p>

              <button
                type="button"
                onClick={unretirePersonAttributeType.bind(this)}
              >
                Unretire Person Attribute Type
              </button>
              <br />
            </div>
          )}

          {personAttributeTypeId !== "add" && (
            <div>
              <hr />

              <p>Delete Person Attribute Type Forever</p>

              <button
                type="button"
                onClick={deletePersonAttributeType.bind(this)}
              >
                Delete Person Attribute Type Forever
              </button>
            </div>
          )}
        </React.Fragment>
      );
    }

    return <p>Loading...</p>;
  }
}
export default withRouter(PersonAttributeTypeForm);
