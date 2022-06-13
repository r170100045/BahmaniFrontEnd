import { Button, Paper } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  createUser,
  inputInfoStyle,
  paperStyle,
} from "../../constants/formStyling";

import Controls from "../../components/controls/Controls";
import { FILTER_OPTIONS } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
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
              {/* <p style={subHeadingStyle}>Add User</p> */}
              <p style={inputInfoStyle}>
                A User account must belong to a Person in the system
              </p>
            </div>
            <div style={{ display: "flex", marginTop: "40px" }}>
              <div
                style={{
                  marginRight: "40px",
                  paddingRight: "40px",
                  borderRight: "2px solid black",
                }}
              >
                <div style={createUser}>Create a new person</div>
                <Button variant="outlined" onClick={() => createNewUser()}>
                  Next
                </Button>
              </div>
              <div>
                <span style={createUser}>Use a person who already exists</span>
                <div>
                  <SingleSelect
                    id="personUUID"
                    name="personUUID"
                    placeholder="Enter user name or uuid"
                    onChange={(selectedValue) =>
                      personChangeHandler(selectedValue)
                    }
                    options={personOptions}
                    filterOption={FILTER_OPTIONS}
                  />

                  <Button
                    style={{ marginTop: "10px" }}
                    variant="outlined"
                    disabled={personNotSelected}
                    onClick={() => createNewUserFromPerson(personUUID)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "40px" }}>
              <Controls.CancelButton onClick={() => cancelButtonHandler()} />
            </div>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

export default withRouter(UserAddPrompt);
