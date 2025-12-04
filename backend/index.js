require("dotenv").config();
const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors")
const { connectDB } = require("./db");

const port = process.env.PORT || 3001;

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // using cors
app.use(express.json()); // using body-parser

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/api/v1", rootRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
    
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    connectDB();
});