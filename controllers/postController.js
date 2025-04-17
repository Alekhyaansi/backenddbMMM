const multer = require("multer");
const Post = require("../models/postModel");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads" directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

// CREATE a new post
exports.createPost = async (req, res) => {
  try {
      const { userid,startDestination, endDestination, date, description } = req.body;

      // Extract uploaded file paths
      const imagePaths = req.files.map(file => file.path); // Save file paths

      // Save post with images in the database
      const newPost = await Post.create({
          startDestination,
          endDestination,
          date,
          description,
          images: JSON.stringify(imagePaths), // Convert array to JSON string
          userId: parseInt(userid, 10) // Assuming you have a userId in the request body
      });

      res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
  }
};

// GET all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// GET a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// GET all posts by user ID
exports.getPostsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const posts = await Post.findAll({ where: { userId } });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts", error });
  }
};


// UPDATE a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { startDestination, endDestination, date, description } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.startDestination = startDestination;
    post.endDestination = endDestination;
    post.date = date;
    post.description = description;
    if (images.length > 0) {
      post.images = JSON.stringify(images);
    }

    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};


// DELETE a post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.destroy();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// Export Multer middleware to use in routes
exports.upload = upload.array("images", 5); // Allow multiple images (max: 5)
