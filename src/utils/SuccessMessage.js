import React from "react";

class SuccessMessage extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p> {this.props.action} successfully</p>
      </div>
    );
  }
}

export default SuccessMessage;
