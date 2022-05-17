import { Redirect, withRouter } from "react-router-dom";
import {
  deletePatientRelationshipTypeById,
  getPatientRelationshipTypeById,
  insertPatientRelationshipType,
  updatePatientRelationshipTypeById,
} from "../../services/patientRelationshipTypeService";

import { GET_VALUE } from "../../constants/otherConstants";
import React from "react";

class PatientRelationshipTypeForm extends React.Component {
  constructor(props) {
    super(props);
    const initialRelationshipTypeState = {
      aisToB: null,
      bisToA: null,
      description: null,
      retireReason: null,
      retired: false,
    };

    this.state = {
      relationshipType: initialRelationshipTypeState,
      relationshipTypeId: this.props.match.params.id,
      redirect: null,
      isLoading: true,
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount() {
    const { relationshipTypeId } = this.state;
    if (relationshipTypeId !== "add") {
      getPatientRelationshipTypeById(relationshipTypeId)
        .then((response) => {
          this.setState({ relationshipType: response.data }, () => {
            this.setState({ isLoading: false });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  inputChangeHandler = (event) => {
    const { name, value } = event.target;
    const { relationshipType } = this.state;
    relationshipType[name] = value;
    this.setState({ relationshipType });
  };

  saveRelationshipType() {
    const { relationshipTypeId, relationshipType } = this.state;
    if (relationshipTypeId === "add")
      this.insertPatientRelationshipTypeWithData(relationshipType);
    else
      this.updateRelationshipTypeWithData(relationshipTypeId, relationshipType);
  }

  insertPatientRelationshipTypeWithData(relationshipType) {
    insertPatientRelationshipType(relationshipType)
      .then(() => {
        this.setState({ redirect: "/patientRelationshipType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateRelationshipTypeWithData(relationshipTypeId, relationshipType) {
    updatePatientRelationshipTypeById(relationshipTypeId, relationshipType)
      .then(() => {
        this.setState({ redirect: "/patientRelationshipType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  retireRelationshipType() {
    const { relationshipTypeId, relationshipType } = this.state;
    relationshipType.retired = true;
    this.setState({ relationshipType }, () => {
      this.updateRelationshipTypeWithData(relationshipTypeId, relationshipType);
    });
  }

  unretireRelationshipType() {
    const { relationshipTypeId, relationshipType } = this.state;
    relationshipType.retireReason = "";
    relationshipType.retired = false;
    this.setState({ relationshipType }, () => {
      this.updateRelationshipTypeWithData(relationshipTypeId, relationshipType);
    });
  }

  deleteRelationshipType() {
    const { relationshipTypeId } = this.state;
    deletePatientRelationshipTypeById(relationshipTypeId)
      .then(() => {
        this.setState({ redirect: "/patientRelationshipType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cancelRelationshipType() {
    this.setState({ redirect: "/patientRelationshipType/view/all" });
  }

  render() {
    const { relationshipType, relationshipTypeId, redirect, isLoading } =
      this.state;
    const {
      saveRelationshipType,
      retireRelationshipType,
      unretireRelationshipType,
      deleteRelationshipType,
      cancelRelationshipType,
      inputChangeHandler,
    } = this;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <p>Loading...</p>;

    return (
      <React.Fragment>
        <div>
          <label htmlFor="aisToB">
            A is to B:
            <input
              type="text"
              id="aisToB"
              name="aisToB"
              value={GET_VALUE(relationshipType.aisToB)}
              onChange={inputChangeHandler}
            />
          </label>
          <br />

          <label htmlFor="bisToA">
            B is to A:
            <input
              type="text"
              id="bisToA"
              name="bisToA"
              value={GET_VALUE(relationshipType.bisToA)}
              onChange={inputChangeHandler}
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
              value={GET_VALUE(relationshipType.description)}
              onChange={inputChangeHandler}
            />
          </label>
          <br />

          <button type="button" onClick={saveRelationshipType.bind(this)}>
            Save
          </button>
          <button type="button" onClick={cancelRelationshipType.bind(this)}>
            Cancel
          </button>
          <br />
        </div>

        {relationshipTypeId !== "add" && !relationshipType.retired && (
          <div>
            <hr />

            <p>Retire Relationship Type</p>

            <label htmlFor="retireReason">
              Reason:
              <input
                type="text"
                id="retireReason"
                name="retireReason"
                value={GET_VALUE(relationshipType.retireReason)}
                onChange={inputChangeHandler}
              />
            </label>
            <br />

            <button type="button" onClick={retireRelationshipType.bind(this)}>
              Retire Relationship Type
            </button>
            <br />
          </div>
        )}

        {relationshipTypeId !== "add" && relationshipType.retired && (
          <div>
            <hr />

            <p>Unretire Relationship Type</p>

            <button type="button" onClick={unretireRelationshipType.bind(this)}>
              Unretire Relationship Type
            </button>
            <br />
          </div>
        )}

        {relationshipTypeId !== "add" && (
          <div>
            <hr />

            <p>Delete Relationship Type Forever</p>

            <button type="button" onClick={deleteRelationshipType.bind(this)}>
              Delete Relationship Type Forever
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(PatientRelationshipTypeForm);
