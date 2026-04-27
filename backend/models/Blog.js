import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    author: { type: String, default: 'Silonka Team' },
    readTime: { type: Number, default: 5 }, // minutes
}, { timestamps: true });

// Auto-generate slug from title if not provided
blogSchema.pre('validate', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
