const AlumniModel = require('../models/alumniModel');
const cloudinary = require('cloudinary').v2


const getProfileDetailsOfAlumni = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required." });
        }

        const data = await AlumniModel.findAlumniByUsername(username);

        if (!data) {
            return res.status(404).json({ success: false, message: "Alumni not found." });
        }

        if (data.isPending || data.isRejected) {
            return res.status(403).json({ success: false, message: "Profile is pending or rejected." });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching alumni details:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


const updateAlumniProfileDetails = async (req, res) => {
    try {
        const { username, name, email, graduationYear, companyName, companyLocation, address} = req.body;
        const profilePhoto = req.files ? req.files.pathname : null;

        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required." });
        }

        // RIght now Throwing a error if profile photo not detected
        if(!profilePhoto){
            return res.status(400).json({ message: 'Profile Photo is required.' });
        }




        const alumni = await AlumniModel.findAlumniByUsername(username);
        if (!alumni) {
            return res.status(404).json({ success: false, message: "Alumni profile not found." });
        }
        //If request was pending or rejected dont allow for updating
        if (alumni.isPending || alumni.isRejected) {
            return res.status(403).json({ success: false, message: "Profile is pending or rejected." });
        }

        let profilePhotoUrl = null;
        if (profilePhoto) {
            const uploadResult = await cloudinary.uploader.upload(profilePhoto.path, {
                folder: 'alumni_profile_photos', // Cloudinary folder for profile photos
                resource_type: 'image',         // Since it's an image file
            });
            profilePhotoUrl = uploadResult.secure_url; // Store the secure URL
        }
        console.log(profilePhotoUrl);
        
        const updates = {
            name,
            email,
            graduationYear,
            companyName,
            companyLocation,
            address,
            profilePhotoUrl,
        };

        // Update the alumni profile
        const result = await AlumniModel.update(alumni.id, updates);

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Failed to update the profile." });
        }

        // Respond with the updated profile
        const updatedProfile = await AlumniModel.findById(alumni.id);
        res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
        console.error("Error updating alumni profile:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getSuggestedAlumnis = async (req, res) => {
    // const { username } = req.user; //if i use middleware it will be in req.user
    const { username } = req.query; //Query Parameters

    try {
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required." });
        }
        const alumni = await AlumniModel.findAlumniByUsername(username);
        

        

        const randomAlumni = await AlumniModel.getRandomAlumni(alumni.id);
        if (randomAlumni.length === 0) {
            return res.status(404).json({ success: false, message: "No alumni found." });
        }

        //The Response Data will have a array of size THree
        res.status(200).json({ success: true, data: randomAlumni });
    } catch (error) {
        console.error("Error fetching suggested alumni:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


module.exports = {getProfileDetailsOfAlumni, updateAlumniProfileDetails, getSuggestedAlumnis};