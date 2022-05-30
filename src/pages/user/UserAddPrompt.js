import { Redirect, Link as RouterLink, withRouter } from "react-router-dom";
import { paperStyle, subHeadingStyle } from "../../constants/formStyling";

import { FILTER_OPTIONS } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import { Paper } from "@material-ui/core";
import React from "react";
import Select from "react-select";
import { SingleSelect } from "react-select-material-ui";
import { getPersons } from "../../services/userService";

class UserAddPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      personOptions: [],
      isLoading: true,
      personUUID: "dummy",
      personNotSelected: true,
    };

    this.createNewUserFromPerson = this.createNewUserFromPerson.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.personChangeHandler = this.personChangeHandler.bind(this);
    this.cancelButtonHandler = this.cancelButtonHandler.bind(this);
  }

  componentDidMount() {
    getPersons()
      .then((response) => {
        const personOptions = [];

        Object.keys(response.data).forEach((key) => {
          if (response.data[key].personName) {
            personOptions.push({
              value: response.data[key].personUuid,
              label: response.data[key].personName,
            });
          }
        });

        this.setState({ personOptions });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  personChangeHandler(selectedValue) {
    this.setState({ personUUID: selectedValue }, () => {
      this.setState({ personNotSelected: false });
    });
  }

  cancelButtonHandler() {
    this.setState({ redirect: "/user/view/all/dummy" });
  }

  createNewUserFromPerson(personUUID) {
    this.setState({ redirect: `/user/edit/add/${personUUID}` });
  }

  createNewUser() {
    this.setState({ redirect: `/user/edit/add/dummy` });
  }

  render() {
    const {
      personChangeHandler,
      createNewUserFromPerson,
      createNewUser,
      cancelButtonHandler,
    } = this;

    const {
      redirect,
      personOptions,
      isLoading,
      personNotSelected,
      personUUID,
    } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <LoadingData />;

    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <div>
            <div>
              <p style={subHeadingStyle}>Add User</p>
              <p>A User account must belong to a Person in the system</p>
            </div>

            <div>
              <p>Create a new person</p>
              <button type="button" onClick={() => createNewUser()}>
                Next
              </button>
            </div>

            <div>
              <p>Use a person who already exists</p>
              <div>
                <SingleSelect
                  label=">Which Person?: "
                  id="personUUID"
                  name="personUUID"
                  placeholder="Enter user name or uuid"
                  onChange={(selectedValue) =>
                    personChangeHandler(selectedValue)
                  }
                  options={personOptions}
                  filterOption={FILTER_OPTIONS}
                />
              </div>

              <div>
                <button
                  type="button"
                  disabled={personNotSelected}
                  onClick={() => createNewUserFromPerson(personUUID)}
                >
                  Next
                </button>
              </div>
            </div>

            <div>
              <button type="button" onClick={() => cancelButtonHandler()}>
                Cancel
              </button>
            </div>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

export default withRouter(UserAddPrompt);
