import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../actions/auth";
import { useDispatch, useSelector } from "react-redux";

export const Navbar = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  //destructure
  const { isAuthenticated, loading } = auth;

  const authLinks = (
    // have to put the () => dispatch(logout()) for this to work
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'>
            <span className='hide-sm'>Dashboard</span>
          </i>
        </Link>
      </li>
      <li>
        <a onClick={() => dispatch(logout())} href='#!'>
          <i className='fas fa-sign-out-alt'>
            <span className='hide-sm'>Logout</span>
          </i>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    // Shows wtv we want depending on our type of user
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};
