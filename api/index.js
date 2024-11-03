const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const PostModel = require('./models/Post');
const salt = bcrypt.genSaltSync(10);
const key = 'azouzbelmouz';

const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://blog:CVwLMnS5DqczUgb8@blog.cyokc.mongodb.net/?retryWrites=true&w=majority&appName=Blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get('/test', (req, res) => {
    res.json('test ok');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json('User not found');
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ username, id: userDoc._id.toString() }, key, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({ id: userDoc._id, username });
            });
        } else {
            res.status(400).json('Incorrect password');
        }
    } catch (err) {
        res.status(500).json('Login error');
        console.error(err);
    }
});

// Sign-in route
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({ username, password: hashedPassword });
        res.json(userDoc);
    } catch (err) {
        res.status(500).json('Sign-in error');
        console.error(err);
    }
});

// Profile route
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, key, {}, (err, info) => {
        if (err) return res.status(403).json('Invalid token');
        res.json(info);
    });
});

// Logout route
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Post creation route
app.post('/post', upload.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, key, {}, async (err, info) => {
        if (err) return res.status(403).json('Invalid token');

        const { title, summary, content } = req.body;
        try {
            const postDoc = await PostModel.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });
            res.json(postDoc);
        } catch (err) {
            res.status(500).json('Error creating post');
            console.error(err);
        }
    });
});

// Fetch all posts route
app.get('/post', async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (err) {
        res.status(500).json('Error fetching posts');
        console.error(err);
    }
});

// Fetch single post by ID route
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await PostModel.findById(id).populate('author', ['username']);
        res.json(postDoc);
    } catch (err) {
        res.status(500).json('Error fetching post');
        console.error(err);

    }
});
app.put('/post',upload.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, key, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await PostModel.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });

      res.json(postDoc);
    });

  });

// Start server
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
