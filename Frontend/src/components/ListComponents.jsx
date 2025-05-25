// src/components/ListComponents.js
import React, { Component } from "react";
import UserServices from "../services/UserServices";
import withRouter from "../utils/withRouter";

class ListComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showUpdateModal: false,
      userToUpdate: null
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers() {
    UserServices.getUsers()
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  }

  addUser = () => {
    this.props.navigate("/add-user");
  };

  editUser = (user) => {
    this.setState({ showUpdateModal: true, userToUpdate: user });
  };

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false, userToUpdate: null });
  };

  deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      UserServices.deleteUser(id).then(() => {
        this.loadUsers();
      });
    }
  };

  viewUser = (id) => {
    this.props.navigate(`/view-user/${id}`);
  };

  handleUserUpdated = () => {
    this.closeUpdateModal();
    this.loadUsers();
  };

  render() {
    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Users List</h2>
        <div className="mb-3 text-end">
          <button className="btn btn-primary" onClick={this.addUser}>Add User</button>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>User Firstname</th>
              <th>User Lastname</th>
              <th>User Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No users found.</td>
              </tr>
            ) : (
              this.state.users.map(user => (
                <tr key={user.id}>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => this.editUser(user)} className="btn btn-info btn-sm me-2">Update</button>
                    <button onClick={() => this.deleteUser(user.id)} className="btn btn-danger btn-sm me-2">Delete</button>
                    <button onClick={() => this.viewUser(user.id)} className="btn btn-secondary btn-sm">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Update Modal */}
        {this.state.showUpdateModal && (
          <UpdateUserModal
            user={this.state.userToUpdate}
            onClose={this.closeUpdateModal}
            onUserUpdated={this.handleUserUpdated}
          />
        )}
      </div>
    );
  }
}

// --- UpdateUserModal Component (popup form) ---

class UpdateUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: props.user.firstname,
      lastname: props.user.lastname,
      email: props.user.email,
      errorMessage: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errorMessage: '' });
  };

  handleSubmit = async (e) => {
  e.preventDefault();

  const { firstname, lastname, email } = this.state;

  if (!firstname || !lastname || !email) {
    this.setState({ errorMessage: 'All fields are required' });
    return;
  }

  // Prepare updated user object WITHOUT id (id is in URL)
  const updatedUser = {
    firstname,
    lastname,
    email
  };

  try {
    await UserServices.updateUser(this.props.user.id, updatedUser);
    alert("User updated successfully!");
    this.props.onUserUpdated();
  } catch (err) {
    console.error("Error updating user", err);

    // Show server error message if exists
    let errorMsg = "Failed to update user.";
    if (err.response && err.response.data && err.response.data.error) {
      errorMsg = err.response.data.error;
    }

    this.setState({ errorMessage: errorMsg });
  }
  };


  render() {
    const { firstname, lastname, email, errorMessage } = this.state;
    const { onClose } = this.props;

    return (
      <div className="modal-backdrop" style={modalBackdropStyle}>
        <div className="modal-content p-4" style={modalContentStyle}>
          <h4 className="mb-3">Update User</h4>
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
              />
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" onClick={onClose} className="btn btn-secondary me-2">Cancel</button>
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Simple inline styles for modal (you can move this to CSS file)
const modalBackdropStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1050
};

const modalContentStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0 5px 15px rgba(0,0,0,.5)'
};

export default withRouter(ListComponents);
