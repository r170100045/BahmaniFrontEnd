import { Redirect, withRouter } from "react-router-dom";
import {
  deleteVisitTypeById,
  getVisitTypeById,
  insertVisitType,
  updateVisitTypeById,
} from "../../services/visitTypeService";

import React from "react";

class VisitTypeForm extends React.Component {
  constructor(props) {
    super(props);
    const initialVisitTypeState = {
      name: "",
      description: "",
      retireReason: "",
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

  nameChangeHandler(event) {
    const { visitType } = this.state;
    visitType.name = event.target.value;
    this.setState({ visitType });
  }

  descriptionChangeHandler(event) {
    const { visitType } = this.state;
    visitType.description = event.target.value;
    this.setState({ visitType });
  }

  saveVisitType() {
    const { visitTypeId, visitType } = this.state;
    console.log("vt", visitType);
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

  retireReasonChangeHandler(event) {
    const { visitType } = this.state;
    visitType.retireReason = event.target.value;
    this.setState({ visitType });
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

  getValueFor(field) {
    return field === null ? "" : field;
  }

  render() {
    const { visitType, visitTypeId, redirect } = this.state;
    const {
      nameChangeHandler,
      descriptionChangeHandler,
      saveVisitType,
      retireReasonChangeHandler,
      retireVisitType,
      unretireVisitType,
      deleteVisitType,
      getValueFor,
      cancelVisitType,
    } = this;

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
              value={getValueFor(visitType.name)}
              onChange={nameChangeHandler.bind(this)}
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
              value={getValueFor(visitType.description)}
              onChange={descriptionChangeHandler.bind(this)}
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
                value={getValueFor(visitType.retireReason)}
                onChange={retireReasonChangeHandler.bind(this)}
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
