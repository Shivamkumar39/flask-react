import React, { Component } from "react";
import UserServices from "../services/UserServices";
import withRouter from "../utils/withRouter";

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      errorMessage: ""
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errorMessage: "" });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email } = this.state;

    if (!firstname || !lastname || !email) {
      this.setState({ errorMessage: "All fields are required" });
      return;
    }

    const newUser = { firstname, lastname, email };

    try {
      await UserServices.createUser(newUser);
      alert("User created successfully!");
      this.props.navigate("/");  // Redirect to users list or wherever you want
    } catch (err) {
      console.error("Error creating user", err);
      this.setState({ errorMessage: "Failed to create user." });
    }
  };

  cancel = () => {
    this.props.navigate("/");
  };

  render() {
    const { firstname, lastname, email, errorMessage } = this.state;

    return (
      <div className="container mt-4">
        <h2 className="mb-4">Create New User</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Firstname</label>
            <input
              type="text"
              name="firstname"
              className="form-control"
              value={firstname}
              onChange={this.handleChange}
              placeholder="Enter firstname"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Lastname</label>
            <input
              type="text"
              name="lastname"
              className="form-control"
              value={lastname}
              onChange={this.handleChange}
              placeholder="Enter lastname"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={email}
              onChange={this.handleChange}
              placeholder="Enter email"
            />
          </div>

          <button type="submit" className="btn btn-primary me-2">Create</button>
          <button type="button" className="btn btn-secondary" onClick={this.cancel}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateUser);
