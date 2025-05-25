// src/components/ViewUserComponent.js
import React, { Component } from "react";
import UserServices from "../services/UserServices";
import withRouter from "../utils/withRouter";

class ViewUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.params.id,
      user: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    UserServices.getUserById(this.state.id)
      .then(res => {
        this.setState({ user: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: "Error fetching user details", loading: false });
        console.error("Error fetching user details", err);
      });
  }

  goBack = () => {
    this.props.navigate("/users");
  };

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">View User Details</h2>
        <div className="card p-4 shadow">
          <p><strong>Firstname:</strong> {user.firstname}</p>
          <p><strong>Lastname:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="btn btn-secondary mt-3" onClick={this.goBack}>Back to List</button>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewUserComponent);
