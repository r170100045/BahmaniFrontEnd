import React, { Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";

class ConceptView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <p>Loading...</p>;
  }
}

export default withRouter(ConceptView);
