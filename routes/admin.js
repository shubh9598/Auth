const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const {jwt_SECRET} = require("../config");

// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const username=req.body.username;
    const password=req.body.password;

    await Admin.create({
        username: username,
        password: password
    })
    res.json({
        msg:'admin created successfully'
    })
});

router.post('/signin',async(req, res) => {
    // Implement admin signup logic
    const username=req.body.username;
    const password=req.body.password;

    const admin= await Admin.find({
        username,
        password
    });
    if(admin){
        const token = jwt.sign({
            username
        }, jwt_SECRET);
        res.json({
            token
        });

    }else{
        res.status(411).json({
            msg:"wrong email and password"
        })
    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const title =req.body.title;
    const description=req.body.description;
    const imageLink=req.body.imageLink;
    const price=req.body.price;
//use zod 
    const newcourse= await Course.create({
        title,
        description,
        imageLink,
        price
    })
    res.json({
        msg:'new course added ' , courseid:newcourse._id 
    })
});

router.get('/courses', adminMiddleware,async(req, res) => {
    // Implement fetching all courses logic
    const allcourses=await Course.find({});
    res.json({
        courses: allcourses
    })
});

module.exports = router;