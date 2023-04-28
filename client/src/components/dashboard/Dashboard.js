import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const Dashboard = props => {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);

  return profile.loading && profile.profile === null ? (
    <Spinner />
  ) : (
    <div className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {auth.user && auth.user.name}
      </p>
      {profile.profile !== null ? <div>has</div> : <div>has not</div>}
    </div>
  );
};

export default Dashboard;
