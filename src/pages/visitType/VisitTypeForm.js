import { Redirect, withRouter } from "react-router-dom";
import {
  deleteVisitTypeById,
  getVisitTypeById,
  insertVisitType,
  updateVisitTypeById,
} from "../../services/visitTypeService";

import { GET_VALUE } from "../../constants/otherConstants";
import React from "react";

class VisitTypeForm extends React.Component {
  constructor(props) {
    super(props);
    const initialVisitTypeState = {
      name: null,
      description: null,
      retireReason: null,
      retired: false,
    };

    this.state = {
      visitType: initialVisitTypeState,
      visitTypeId: this.props.match.params.id,
      redirect: null,
    };
  }

  componentDidMount() {
    const { visitTypeId } = this.state;
    if (visitTypeId !== "add") {
      getVisitTypeById(visitTypeId)
        .then((response) => {
          this.setState({ visitType: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  inputChangeHandler = (event) => {
    const { name, value } = event.target;
    const { visitType } = this.state;
    visitType[name] = value;
    this.setState({ visitType });
  };

  saveVisitType() {
    const { visitTypeId, visitType } = this.state;
    if (visitTypeId === "add") this.insertVisitTypeWithData(visitType);
    else this.updateVisitTypeWithData(visitTypeId, visitType);
  }

  insertVisitTypeWithData(visitType) {
    insertVisitType(visitType)
      .then(() => {
        this.setState({ redirect: "/visitType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateVisitTypeWithData(visitTypeId, visitType) {
    console.log("vtid", visitTypeId);
    updateVisitTypeById(visitTypeId, visitType)
      .then(() => {
        this.setState({ redirect: "/visitType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  retireVisitType() {
    const { visitTypeId, visitType } = this.state;
    visitType.retired = true;
    this.setState({ visitType }, () => {
      this.updateVisitTypeWithData(visitTypeId, visitType);
    });
  }

  unretireVisitType() {
    const { visitTypeId, visitType } = this.state;
    visitType.retireReason = "";
    visitType.retired = false;
    this.setState({ visitType }, () => {
      this.updateVisitTypeWithData(visitTypeId, visitType);
    });
  }

  deleteVisitType() {
    const { visitTypeId } = this.state;
    deleteVisitTypeById(visitTypeId)
      .then(() => {
        this.setState({ redirect: "/visitType/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cancelVisitType() {
    this.setState({ redirect: "/visitType/view/all" });
  }

  render() {
    const {
      inputChangeHandler,
      saveVisitType,
      retireVisitType,
      unretireVisitType,
      deleteVisitType,
      cancelVisitType,
    } = this;

    const { visitType, visitTypeId, redirect } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    return (
      <React.Fragment>
        <div>
          <label htmlFor="name">
            Name :
            <input
              type="text"
              id="name"
              name="name"
              value={GET_VALUE(visitType.name)}
              onChange={inputChangeHandler.bind(this)}
            />
          </label>
          <br />

          <label htmlFor="description">
            Description :
            <textarea
              id="description"
              name="description"
              rows="3"
              cols="20"
              value={GET_VALUE(visitType.description)}
              onChange={inputChangeHandler.bind(this)}
            />
          </label>
          <br />

          <button type="button" onClick={saveVisitType.bind(this)}>
            Save
          </button>
          <button type="button" onClick={cancelVisitType.bind(this)}>
            Cancel
          </button>
          <br />
        </div>

        {visitTypeId !== "add" && !visitType.retired && (
          <div>
            <hr />

            <p>Retire Visit Type</p>

            <label htmlFor="retireReason">
              Reason:
              <input
                type="text"
                id="retireReason"
                name="retireReason"
                value={GET_VALUE(visitType.retireReason)}
                onChange={inputChangeHandler.bind(this)}
              />
            </label>
            <br />

            <button type="button" onClick={retireVisitType.bind(this)}>
              Retire Visit Type
            </button>
            <br />
          </div>
        )}

        {visitTypeId !== "add" && visitType.retired && (
          <div>
            <hr />

            <p>Unretire Visit Type</p>

            <button type="button" onClick={unretireVisitType.bind(this)}>
              Unretire Visit Type
            </button>
            <br />
          </div>
        )}

        {visitTypeId !== "add" && (
          <div>
            <hr />

            <p>Delete Visit Type Forever</p>

            <button type="button" onClick={deleteVisitType.bind(this)}>
              Delete Visit Type Forever
            </button>
            <br />
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(VisitTypeForm);
