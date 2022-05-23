import { Redirect, Link as RouterLink, withRouter } from "react-router-dom";

import { FILTER_OPTIONS } from "../../constants/otherConstants";
import React from "react";
import Select from "react-select";
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

  personChangeHandler(selectedOption) {
    this.setState({ personUUID: selectedOption.value }, () => {
      this.setState({ personNotSelected: false });
    });
  }

  cancelButtonHandler() {
    this.setState({ redirect: "/user/view/all/dummy" });
  }

  render() {
    const { personChangeHandler } = this;

    const {
      redirect,
      personOptions,
      isLoading,
      personNotSelected,
      personUUID,
      cancelButtonHandler,
    } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) <p>Loading...</p>;

    return (
      <React.Fragment>
        <p>User Management</p>
        <div>
          <div>
            <p>Add User</p>
            <p>A User account must belong to a Person in the system</p>

            <div>
              <div>
                <p>Create a new person</p>
                <button type="button">
                  <a href={`/user/edit/add/dummy`}>Next</a>
                </button>
              </div>
              <div>
                <p>Use a person who already exists</p>
                <div>
                  <label htmlFor="personUUID">Which Person?: </label>
                  <div style={{ width: "300px", display: "inline-block" }}>
                    <Select
                      id="personUUID"
                      name="personUUID"
                      placeholder="Enter user name or uuid"
                      onChange={personChangeHandler.bind(this)}
                      options={personOptions}
                      filterOption={FILTER_OPTIONS}
                    />
                  </div>
                </div>

                <div>
                  <button type="button" disabled={personNotSelected}>
                    <RouterLink
                      to={`/user/edit/add/${personUUID}`}
                      disabled={personNotSelected}
                    >
                      Next
                    </RouterLink>

                    {/* <a
                      href={`/user/edit/add/${personUUID}`}
                      disabled={personNotSelected}
                    >
                      Next
                    </a> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              // onClick={cancelButtonHandler.bind(this)}
            >
              <RouterLink to={`/user/view/all/dummy`}>Cancel</RouterLink>
              {/* <a href={`/user/view/all/dummy`}>Cancel</a> */}
              {/* Cancel */}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(UserAddPrompt);
