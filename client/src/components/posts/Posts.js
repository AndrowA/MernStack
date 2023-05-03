import React, { Fragment, useEffect } from "react";
import { getPosts } from "../../actions/post";
import Spinner from "../layout/Spinner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { PostItem } from "./PostItem";
import { PostForm } from "./PostForm";

export const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(state => state.post);

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className='container'>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome to the community
      </p>
      {<PostForm />}
      <div className='posts'>
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};
