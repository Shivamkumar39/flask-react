import React from 'react';
import HeaderComponent from './components/HeaderComponent';
import ListComponents from './components/ListComponents';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewUserComponent from './components/ViewUserComponent';
import CreateUser from './components/CreateUser';

function App() {
  return (
    <Router>
      <div>
        <HeaderComponent />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<ListComponents />} />
            <Route path="/users" element={<ListComponents />} />
            <Route path="/add-user" element={<CreateUser />} />
            <Route path="/view-user/:id" element={<ViewUserComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
