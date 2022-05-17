import { Redirect, withRouter } from "react-router-dom";
import {
  deleteVisitTypeById,
  getVisitTypeById,
  insertVisitType,
  updateVisitTypeById,
} from "../../services/visitTypeService";

import { GET_VALUE } from "../../constants/otherConstants";
import React from "react";
import { Paper, TextField, Button } from "@material-ui/core";
import {
  buttonGroupStyle,
  buttonStyle,
  subHeadingStyle,
  inputStyle,
  paperStyle,
} from "../../constants/formStyling";

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
        <Paper style={paperStyle}>
          <TextField
            style={inputStyle}
            label="Name"
            type="text"
            id="name"
            name="name"
            value={GET_VALUE(visitType.name)}
            onChange={inputChangeHandler.bind(this)}
          />
          <br />
          <TextField
            style={inputStyle}
            label="Description"
            id="description"
            name="description"
            rows="3"
            cols="20"
            multiline
            value={GET_VALUE(visitType.description)}
            onChange={inputChangeHandler.bind(this)}
          />
          <br />
          <div style={buttonGroupStyle}>
            <Button type="button" onClick={saveVisitType.bind(this)}>
              Save
            </Button>
            <Button type="button" onClick={cancelVisitType.bind(this)}>
              Cancel
            </Button>
          </div>

          <br />
        </Paper>

        {visitTypeId !== "add" && !visitType.retired && (
          <Paper style={paperStyle}>
            <TextField
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              multiline
              value={GET_VALUE(visitType.retireReason)}
              onChange={inputChangeHandler.bind(this)}
            />
            <br />
            <div style={buttonGroupStyle}>
              <Button type="button" onClick={retireVisitType.bind(this)}>
                Retire Visit Type
              </Button>
            </div>

            <br />
          </Paper>
        )}

        {visitTypeId !== "add" && visitType.retired && (
          <Paper style={paperStyle}>
            <hr />

            <p style={subHeadingStyle}>Unretire Visit Type</p>
            <div style={buttonGroupStyle}>
              <Button type="button" onClick={unretireVisitType.bind(this)}>
                Unretire Visit Type
              </Button>
            </div>

            <br />
          </Paper>
        )}

        {visitTypeId !== "add" && (
          <div style={paperStyle}>
            <div style={buttonGroupStyle}>
              <Button type="button" onClick={deleteVisitType.bind(this)}>
                Delete Visit Type Forever
              </Button>
            </div>
            <br />
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(VisitTypeForm);
