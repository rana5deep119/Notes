const express = require("express")
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/userModel')
const jwt = require("jsonwebtoken")
const { authenticateToken } = require('./utilities')
const Note = require('./models/noteModel')
app.use(express.json())
app.use(cors({
    origin: "*",
}))

app.get("/", (req, res) => {
    res.json({ data: "hello" })
})
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Fullname is required" })
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "email is required" })
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "password is required" })
    }

    const isUser = await User.findOne({ email: email })
    if (isUser) {
        res.json({ message: "user already exist" })
    }

    const user = new User({
        fullName, email, password,
    });
    await user.save()

    const accessToken = jwt.sign({ user }, process.env.Access_token_secret, { expiresIn: "300m" })

    res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful"

    })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "email is required" })
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "password is required" })
    }

    const userInfo = await User.findOne({ email: email })

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" })
    }

    if (userInfo.email === email && userInfo.password == password) {
        const user = { user: userInfo }
        const accessToken = jwt.sign(user, process.env.Access_token_secret, { expiresIn: "3d" })

        return res.json({
            error: false,
            email,
            accessToken,
            message: "Login Successful"

        })
    } else {
        return res.status(400).json({
            error: true,
            message: "invalid credentials"
        })
    }

})

app.get("/get-user", authenticateToken, async (req, res) => {
    const user = req.user.user;

    const isUser = await User.findOne({ _id: user._id })

    if (!isUser) { return res.sendStatus(401) }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },

        message: ""
    })
})
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user.user;



    if (!title) {
        return res.status(400).json({ error: true, message: "title is required" })
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "contentis required" })
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id

        })
        await note.save();

        return res.json({
            error: false,
            note,
            message: "note added Successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "internal server error"
        })
    }
})

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res
            .status(400)
            .json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const user = req.user.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 })

        return res.json({
            error: false,
            notes,
            message: "All Notes retrieved succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "internal server error"
        })
    }

})

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    // const { user } = req.user;
    const user = req.user.user;


    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.get("/search-notes/", authenticateToken, async (req, res) => {
    const user = req.user.user;
    const { query } = req.query

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "search query is required"
        })
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "internal server error"
        })
    }
})
const connectdb = async () => {
    try {
        await mongoose.connect(process.env.connectionString);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectdb();
})

module.exports = app