// src/utils/withRouter.js
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function withRouter(Component) {
  return function(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return React.createElement(Component, { ...props, params, navigate, location });
  };
}
