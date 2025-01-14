const Post = require('../models/postsModel')
const AlumniModel = require('../models/alumniModel');
const cloudinary = require('cloudinary').v2



const addPost = async (req, res) => {
    const { username } = req.body;
    try {
      if (!req.files || req.files.length === 0) {
                 return res.status(400).send('No files uploaded.');
      }
  
      const urls = [];
      //This is cloudinary logic which creates url for any number of posts uploaded and pushs to array urls
      for (const file of req.files) {
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          ).end(file.buffer); 
        });
        urls.push(uploadResponse);
      }
  
      
      const alumni = await AlumniModel.findAlumniByUsername(username);
      const alumniId = alumni.id;
      const description = req.body.description; 
      const postUrls = urls; 
  
      // Use the Post model to create a new post
      const postId = await Post.create(alumniId, postUrls, description);
  

      res.json({
        message: 'Post created successfully',
        post: { id: postId, alumni, postUrls, description },//sending alumni because to display about alumni in the post like Company his name
      });
    } catch (err) {
      console.error('Error in addPost:', err);
      res.status(500).send('Error uploading files.');
    }
  };
  
//TOcheck with post man only
// const addPost = async (req, res) => {
//   const { username } = req.body;
//   try {
    
//     const alumni = await AlumniModel.findAlumniByUsername(username);
//     const alumniId = alumni.id;
//     const description = req.body.description; 
//     const postUrls = req.body.urls; 

//     // Use the Post model to create a new post
//     const postId = await Post.create(alumniId, postUrls, description);


//     res.json({
//       message: 'Post created successfully',
//       post: { id: postId, alumni, postUrls, description },//sending alumni because to display about alumni in the post like Company his name
//     });
//   } catch (err) {
//     console.error('Error in addPost:', err);
//     res.status(500).send('Error uploading files.');
//   }
// };

  //Delet the post of alumni
const deletePost = async (req, res) => {
    const{ postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }
    try {
      const isDeleted = await Post.delete(postId)
      if(!isDeleted){
        return res.status(400).json({
          message: "Post not found or could not be deleted"
        })
      }
      return res.status(200).json({
        success: true,
        message: "Post Deleted Successfully",
      })
    } catch (error) {
      console.error("Error deleting post:", error.message);
    return res.status(500).json({
      message: "An internal server error occurred while deleting the post",
      error: error.message,
    });
    }
}

//Increae the like count when a user likes the post (total like count)
const increaseLikeCount = async (req, res) => {
  const{ postId } = req.body;
  if (!postId) {
    return res.status(400).json({
      message: "Post ID is required",
    });
  }
  try {
    const isLike = await Post.like(postId)
    if(!isLike){
      return res.status(400).json({
        message: "Post not found or unable to increase like count"
      })
    }
    return res.status(200).json({
      success: isLike,
      message: "Post Liked Successfully",
    })
  } catch (error) {
    console.error("Error increasing like count:", error.message);
    return res.status(500).json({
      message: "An internal server error occurred while increasing like count",
      error: error.message,
    });
  }
}
//Make sure a user cannot like the post more than once.....plzzzz


//Get three renadom posts from friends of alumni
const getRandomPosts = async (req, res) => {
    
}

//Get all the posts of alumni
const getAllPostsOfAlumni = async (req, res) => {
  const { username } = req.query; 
    try {
        const alumni = await AlumniModel.findAlumniByUsername(username);
        if(!alumni){
          return res.status(400).json({
            message: "No Alumni Found",
          })
        }
        const posts = await Post.getAllPostsByAlumniId(alumni.id);
        if(!posts || posts.length === 0){
          return res.status(400).json({
            message: "You Have Not uploaded any posts",
          })
        }
        return res.status(200).json({
          alumni,
          posts
        })
    } catch (error) {
      console.error("Error fetching alumni posts:", error);
      return res.status(500).json({
        message: "An error occurred while fetching posts.",
        error: error.message,
      });
    }
}





module.exports = {addPost, getRandomPosts, getAllPostsOfAlumni, deletePost, increaseLikeCount};