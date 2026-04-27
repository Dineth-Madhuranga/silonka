import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
}, { timestamps: true });

// Auto-generate slug from name
categorySchema.pre('validate', function (next) {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
