import { Redirect, withRouter } from 'react-router-dom';

import React from 'react';
import Select from 'react-select';
import { getPersons } from '../../api/services';

// import {
//   deleteDrugById,
//   getConceptNames,
//   getDrugById,
//   postDrug,
//   putDrugById
// } from "../../api/services";

class UserAddPrompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      personOptions: [],
      isLoading: true,
      personUUID: null,
      personNotSelected: true,
    };
  }

  componentDidMount() {
    getPersons()
      .then((response) => {
        const personOptions = [];
        Object.keys(response.data).forEach((key) => {
          personOptions.push({
            value: response.data[key].uuid,
            label: response.data[key].concatenatedName,
          });
        });

        this.setState({ personOptions }, () => {
          this.setState({ isLoading: false });
        });
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

  filterOptions(option, inputValue) {
    const { label, value } = option;
    return (
      (label != null &&
        label.toLowerCase().includes(inputValue.toLowerCase())) ||
      value.toString().toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  createNewPerson() {}

  createNewUser() {}

  cancelButtonHandler() {
    this.setState({ redirect: '/user/all' });
  }

  render() {
    const { filterOptions, personChangeHandler, createNewPerson } = this;

    const { redirect, personOptions, isLoading, personNotSelected } =
      this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (!isLoading) {
      return (
        <React.Fragment>
          <p>User Management</p>

          <div>
            <p>Add User</p>
            <p>A User account must belong to a Person in the system</p>

            <div>
              <div>
                <p>Create a new person</p>
                <button type="button" onClick={createNewPerson.bind(this)}>
                  Next
                </button>
              </div>
              <div>
                <p>Use a person who already exists</p>
                <div>
                  <label htmlFor="conceptId">Which Person?: </label>
                  <div style={{ width: '300px', display: 'inline-block' }}>
                    <Select
                      id="personUUID"
                      name="personUUID"
                      placeholder="Enter user name or uuid"
                      onChange={personChangeHandler.bind(this)}
                      options={personOptions}
                      filterOption={filterOptions}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    disabled={personNotSelected}
                    // onClick={createNewUser.bind(this)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return <p>Loading...</p>;
  }
}

export default withRouter(UserAddPrompt);
