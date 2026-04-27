import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' };
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, weight, intensity, inStock } = req.body;
        // Image can come from file upload (multer) or URL string
        let image = '/images/sample.jpg';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            image = req.body.image;
        }

        const product = new Product({
            name: name || 'Sample name',
            price: Number(price) || 0,
            user: req.user._id,
            image,
            category: category || 'Sample category',
            description: description || 'Sample description',
            weight: weight || '100g',
            intensity: intensity ? Number(intensity) : undefined,
            inStock: inStock !== undefined ? inStock === 'true' || inStock === true : true,
            id: `prod-${Date.now()}`
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, weight, intensity, inStock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name ?? product.name;
        product.price = price !== undefined ? Number(price) : product.price;
        product.description = description ?? product.description;
        product.category = category ?? product.category;
        product.weight = weight ?? product.weight;
        if (intensity !== undefined) product.intensity = Number(intensity);
        if (inStock !== undefined) product.inStock = inStock === 'true' || inStock === true;

        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            product.image = req.body.image;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
