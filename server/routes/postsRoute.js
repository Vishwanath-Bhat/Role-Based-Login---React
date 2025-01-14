const express = require('express');
const { upload, cleanUpFile } = require('../middlewares/fileHandler');
const verifyToken = require('../middlewares/requireAuth')

const {addPost, getAllPostsOfAlumni, increaseLikeCount, deletePost} = require('../controllers/postsController')



const router = express.Router();

router.post('/add',upload.array('posts'), addPost); //keep the name of formdata as posts in frontend
// router.post('/add', addPost);

router.get('/allposts',getAllPostsOfAlumni); // Gett all posts of a alumni

router.post('/likecount',increaseLikeCount); // INcrease the total like count of the post

router.delete('/delete', deletePost); // Delete the post

module.exports = router;