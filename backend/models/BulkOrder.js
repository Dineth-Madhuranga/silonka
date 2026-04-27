import mongoose from 'mongoose';

const bulkOrderSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    products: [{
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    notes: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

const BulkOrder = mongoose.model('BulkOrder', bulkOrderSchema);
export default BulkOrder;
