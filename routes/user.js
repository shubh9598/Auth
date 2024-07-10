const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username,
        password
    })
    res.json({
        msg:"user created"
    })
});

router.post('/signin',async (req, res) => {
    // Implement admin signup logic
    const username=req.body.username;
    const password=req.body.password;

    const user= await User.find({
        username,
        password
    });
    if(user){
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

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    const allcourses =await Course.find({});
    res.json({
        courses: allcourses
    })

});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const username=req.username;
    const courseId= req.params.courseId;
    try{
        await User.updateOne({
            username:username,
            password:password
        },{
            "$push":{
                purchasedCourses:courseId
            }
        })
    }catch(e){
        console.log(e)
    };
    res.json({
        msg:"purchase completed"
    })

});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    const user= await User.findOne({
        password:req.headers.password
    });
    const courses =await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });
    res.json({
        courses:courses
    })
});

module.exports = router