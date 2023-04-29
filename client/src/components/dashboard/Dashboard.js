import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import { DashboardActions } from "./DashboardActions";
import { Experience } from "./Experience";
import { Education } from "./Education";

const Dashboard = (props) => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);

  return profile.loading && profile.profile === null ? (
    <Spinner />
  ) : (
    <div className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {auth.user && auth.user.name}
      </p>
      {profile.profile !== null ? (
        <div>
          <DashboardActions />
          <Experience experience={profile.profile.experience} />
          <Education education={profile.profile.education} />
        </div>
      ) : (
        <div>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
