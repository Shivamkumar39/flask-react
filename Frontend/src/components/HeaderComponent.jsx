import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ' React and Flask',
    };
  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark container-fluid">
          <a href="/" className="navbar-brand d-flex align-items-center">
            <span className="ms-2 text-white">{this.state.message}</span>
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/users">
                Users
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default HeaderComponent;
