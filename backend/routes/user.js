const express = require("express");
const zod = require("zod")
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// zod valiate function
function validateInput(obj){
    const schema = zod.object({
        username: zod.string().email(),
        password: zod.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
        lastName: zod.string(),
        firstName: zod.string()
    })
    return schema.safeParse(obj)
}

// test get router
router.get("/test" , (req,res) => {
    res.send("Hello from user router.")
})

// router for signup
router.post("/signup" , async (req,res) => {
    try{
        const response = req.body;
        const validateResponse = validateInput(response);

        if(!validateResponse.success){
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            })
        }

        const existingUser = await User.findOne({
            username: req.body.username
        })

        if(existingUser){
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            })
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })

        const userID = user._id

            /// ------- Creating new account ------- 
            await Account.create({
                userID,
                balance: 1 + Math.random() * 10000
            })
            /// -----------------------------    ///

        const token = jwt.sign({
            userID 
        }, JWT_SECRET)

        res.status(200).json({
            message: "User created successfully",
            token: token
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
          message: "Internal server error"
        });
    }

});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin" , async (req,res) => {


    try{    
        const response = req.body;
        const success = signinBody.safeParse(response);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }

        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        })

        if(!user){
            return res.status(411).json({
                message: "User doesn't exist! Please login"
            })
        }
        
        const token = jwt.sign({
            userID: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
    }
    catch{
        res.status(411).json({
            message: "Error while logging in"
        })
    }
})

// update the user details
const updateBody = zod.object({
    password: zod.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).optional(),
    lastName: zod.string().optional(),
    firstName: zod.string().optional()    
})

router.put("/" , authMiddleware ,  async (req,res) => {
    const {updatedResponse} = updateBody.safeParse(req.body);

    if(!updatedResponse){
        return res.status(403).json({
            message: "Error while updating informatio"
        })
    }

    await User.updateOne({_id: req.userID}, req.body);

    res.json({
        message:"Updated Successfully"
    })

})

// Route to get users from the backend, filterable via firstName/lastName

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router ;