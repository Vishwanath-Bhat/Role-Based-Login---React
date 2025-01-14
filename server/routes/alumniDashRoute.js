const express = require('express');
const { upload, cleanUpFile } = require('../middlewares/fileHandler');
const verifyToken = require('../middlewares/requireAuth')

const {getProfileDetailsOfAlumni, updateAlumniProfileDetails, getSuggestedAlumnis} = require('../controllers/alumniDashController')



const router = express.Router();




router.post('/profiledetails', getProfileDetailsOfAlumni);

router.post('/profileupdate', upload.single('profilePhoto'), updateAlumniProfileDetails)

router.get('/suggest', getSuggestedAlumnis)



module.exports = router;