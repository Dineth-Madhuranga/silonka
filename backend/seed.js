import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const allProducts = [
    {
        id: 'ceylon-set',
        name: 'The Silonka Set',
        description: 'Four essential spices in elegant gift packaging',
        price: 89,
        image: '/collection_set.jpg',
        category: 'sets',
        weight: '4 x 75g',
    },
    {
        id: 'black-pepper',
        name: 'Tellicherry Black Pepper',
        description: 'Extra-bold peppercorns with citrus and floral notes',
        price: 24,
        image: '/pepper_palette.jpg',
        category: 'pepper',
        weight: '100g',
        intensity: 80,
    },
    {
        id: 'white-pepper',
        name: 'Muntok White Pepper',
        description: 'Milder, earthier flavor perfect for light sauces',
        price: 22,
        image: '/pepper_palette.jpg',
        category: 'pepper',
        weight: '100g',
        intensity: 50,
    },
    {
        id: 'ceylon-cinnamon',
        name: 'True Ceylon Cinnamon',
        description: 'Delicate, sweet, naturally low in coumarin',
        price: 14,
        image: '/cinnamon_signature.jpg',
        category: 'cinnamon',
        weight: '50g',
    },
    {
        id: 'cinnamon-powder',
        name: 'Ceylon Cinnamon Powder',
        description: 'Fine-ground for baking and beverages',
        price: 16,
        image: '/ground_powder.jpg',
        category: 'cinnamon',
        weight: '75g',
    },
    {
        id: 'whole-cloves',
        name: 'Hand-Picked Cloves',
        description: 'Intense aroma, perfect for mulled wine and curries',
        price: 18,
        image: '/whole_spices.jpg',
        category: 'spices',
        weight: '50g',
    },
    {
        id: 'cardamom',
        name: 'Green Cardamom Pods',
        description: 'Fragrant pods for chai and desserts',
        price: 28,
        image: '/whole_spices.jpg',
        category: 'spices',
        weight: '40g',
    },
    {
        id: 'nutmeg',
        name: 'Whole Nutmeg',
        description: 'Fresh-grated warmth for béchamel and baking',
        price: 12,
        image: '/whole_spices.jpg',
        category: 'spices',
        weight: '30g',
    },
    {
        id: 'pepper-powder',
        name: 'Black Pepper Powder',
        description: 'Coarse-ground for everyday cooking',
        price: 20,
        image: '/ground_powder.jpg',
        category: 'pepper',
        weight: '100g',
        intensity: 75,
    }
];

const importData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Silonka@2026', salt);

        const adminUser = {
            name: 'Admin Silonka',
            email: 'admin@silonka.com',
            password: hashedPassword,
            isAdmin: true,
        };

        await User.insertMany([adminUser]);
        await Product.insertMany(allProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
