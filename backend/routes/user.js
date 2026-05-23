const express = require("express");
const zod = require("zod")
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const bcrypt = require("bcrypt");

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
            const errors = validateResponse.error.errors;
            let errorMessage = "Invalid input. ";
            
            // Check for specific validation errors
            const emailError = errors.find(e => e.path.includes('username'));
            const passwordError = errors.find(e => e.path.includes('password'));
            const firstNameError = errors.find(e => e.path.includes('firstName'));
            const lastNameError = errors.find(e => e.path.includes('lastName'));
            
            if (emailError) {
                errorMessage = "Invalid email format. Please enter a valid email address.";
            } else if (passwordError) {
                if (passwordError.message.includes('minimum')) {
                    errorMessage = "Password must be at least 6 characters long.";
                } else if (passwordError.message.includes('regex')) {
                    errorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
                } else {
                    errorMessage = "Password does not meet requirements.";
                }
            } else if (firstNameError || lastNameError) {
                errorMessage = "First name and last name are required.";
            } else {
                errorMessage = "Please fill in all required fields correctly.";
            }
            
            return res.status(411).json({
                message: errorMessage
            })
        }

        const existingUser = await User.findOne({
            username: req.body.username
        })

        if(existingUser){
            return res.status(411).json({
                message: "Email already taken. Please use a different email address."
            })
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
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
        console.error("Signup error:", error);
        res.status(500).json({
          message: "Internal server error",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        if (!success.success) {
            const errors = success.error.errors;
            const emailError = errors.find(e => e.path.includes('username'));
            
            if (emailError) {
                return res.status(411).json({
                    message: "Invalid email format. Please enter a valid email address."
                })
            }
            
            return res.status(411).json({
                message: "Please enter both email and password."
            })
        }

        const user = await User.findOne({
            username: req.body.username
        })

        if(!user){
            return res.status(411).json({
                message: "Invalid email or password"
            })
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if(!isPasswordValid){
            return res.status(411).json({
                message: "Invalid email or password"
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
    try {
        const {success, data: updatedResponse} = updateBody.safeParse(req.body);

        if(!success){
            return res.status(403).json({
                message: "Error while updating information"
            })
        }

        // Check if at least one field is being updated
        if (!updatedResponse || Object.keys(updatedResponse).length === 0) {
            return res.status(400).json({
                message: "No fields to update"
            })
        }

        // Hash password if it's being updated
        if (updatedResponse.password) {
            updatedResponse.password = await bcrypt.hash(updatedResponse.password, 10);
        }

        await User.updateOne({_id: req.userID}, updatedResponse);

        res.json({
            message:"Updated Successfully"
        })
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            message: "Error while updating information",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})

// Route to get users from the backend, filterable via firstName/lastName

router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";


        let query = {};
        if (filter) {
            const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query = {
                $or: [{
                    firstName: {
                        "$regex": escapedFilter,
                        "$options": "i" 
                    }
                }, {
                    lastName: {
                        "$regex": escapedFilter,
                        "$options": "i" 
                    }
                }]
            };
        }

        const users = await User.find(query);

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error("Bulk user search error:", error);
        res.status(500).json({
            message: "Error fetching users",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})

// Route to get current user's info
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userID });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json({
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            message: "Error fetching user",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})


module.exports = router ;