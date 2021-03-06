import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";

class StaffSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currPanel: 1,
    };

    this.handleCurrPanelChange = this.handleCurrPanelChange.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  handleCurrPanelChange(num) {
    this.setState({ currPanel: num });
  }

  renderComponent() {}

  initPage() {}

  render() {
    let currPanel = 1;
    return (
      <div className="filter-panel">
        <h3 style={{ fontWeight: "bold", color: "white" }}>
          Hi, {this.props.firstName}
        </h3>

        <Link to="/accountInfo">
          <Button
            style={{ width: "100%", marginBottom: "10px" }}
            color="secondary"
            onClick={this.handleCurrPanelChange}
          >
            Restaurant Profile
          </Button>
        </Link>

        <Link to="/orderHistory">
          <Button
            style={{ width: "100%", marginBottom: "10px" }}
            color="secondary"
            onClick={this.handleCurrPanelChange}
          >
            Order History
          </Button>
        </Link>

        <Link to="/myPaymentMethods">
          <Button
            style={{ width: "100%" }}
            color="secondary"
            onClick={this.handleCurrPanelChange}
          >
            My payment methods
          </Button>
        </Link>
      </div>
    );
  }
}

export default StaffSideBar