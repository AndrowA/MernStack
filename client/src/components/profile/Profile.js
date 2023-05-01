import React, { Fragment } from "react";
import { getProfileById } from "../../actions/profile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../layout/Spinner";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ProfileTop } from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";

export const Profile = ({ match }) => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.profile);
  const auth = useSelector(state => state.auth);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [getProfileById, id]);

  return (
    <div className='container'>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            {" "}
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading == false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                {" "}
                Edit Profile
              </Link>
            )}
          <div class='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                profile.experience.map(experience => (
                  <ProfileExperience
                    key={experience._id}
                    experience={experience}
                  />
                ))
              ) : (
                <h4> No Experience Credentials </h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                profile.education.map(education => (
                  <ProfileEducation key={education._id} education={education} />
                ))
              ) : (
                <h4> No Experience Credentials </h4>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};
