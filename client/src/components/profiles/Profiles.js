import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../layout/Spinner";
import { useSelector } from "react-redux";
import { getProfiles } from "../../actions/profile";
import ProfileItem from "./ProfileItem";

export const Profiles = () => {
  const dispatch = useDispatch();
  const { profiles, loading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(getProfiles());
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className='container'>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i>Browse and connect with
            developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found ...</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
