import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../actions/post";
import { Link, useParams } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { PostItem } from "../posts/PostItem";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

export const Post = () => {
  const dispatch = useDispatch();
  const { post, loading } = useSelector(state => state.post);
  const id = useParams();

  useEffect(() => {
    dispatch(getPost(id.id));
  }, []);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <div className='container'>
      <Link to='/posts' className='btn'>
        {" "}
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={id.id} />
      <div className='comments'>
        {post.comments.map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            postId={id.id}
          ></CommentItem>
        ))}
      </div>
    </div>
  );
};
