import BulkOrder from '../models/BulkOrder.js';
import nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendBulkOrderEmails = async (order) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not set. Skipping email notifications.');
        return;
    }
    const transporter = createTransporter();

    const productList = order.products
        .map((p) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${p.productName}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${p.quantity} units</td></tr>`)
        .join('');

    const emailTemplate = (forAdmin) => `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a18;color:#f5f0e8;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#c9a96e,#a8834f);padding:40px 32px;">
        <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:2px;">SILONKA</h1>
        <p style="margin:8px 0 0;font-size:13px;opacity:0.85;letter-spacing:1px;">PREMIUM SPICES WHOLESALE</p>
      </div>
      <div style="padding:32px;">
        <h2 style="font-size:20px;font-weight:400;color:#c9a96e;margin:0 0 8px;">Bulk Order ${forAdmin ? 'Received' : 'Confirmation'}</h2>
        <p style="color:#a0967e;font-size:14px;margin:0 0 24px;">Reference #${order._id.toString().slice(-8).toUpperCase()}</p>
        
        <table style="width:100%;background:#24241f;border-radius:8px;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:12px;color:#a0967e;font-size:12px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #333;">Company</td><td style="padding:12px;color:#f5f0e8;">${order.companyName}</td></tr>
          <tr><td style="padding:12px;color:#a0967e;font-size:12px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #333;">Contact</td><td style="padding:12px;color:#f5f0e8;">${order.contactName}</td></tr>
          <tr><td style="padding:12px;color:#a0967e;font-size:12px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #333;">Email</td><td style="padding:12px;color:#f5f0e8;">${order.email}</td></tr>
          <tr><td style="padding:12px;color:#a0967e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Phone</td><td style="padding:12px;color:#f5f0e8;">${order.phone}</td></tr>
        </table>
        
        <h3 style="font-size:14px;color:#c9a96e;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Requested Products</h3>
        <table style="width:100%;background:#24241f;border-radius:8px;border-collapse:collapse;margin-bottom:24px;">
          <tr style="background:#2d2d27;"><th style="padding:10px 12px;text-align:left;color:#a0967e;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Product</th><th style="padding:10px 12px;text-align:left;color:#a0967e;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Quantity</th></tr>
          ${productList}
        </table>
        
        ${order.notes ? `<div style="background:#24241f;border-radius:8px;padding:16px;margin-bottom:24px;"><p style="margin:0 0 6px;color:#a0967e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Notes</p><p style="margin:0;color:#f5f0e8;font-size:14px;line-height:1.6;">${order.notes}</p></div>` : ''}
        
        ${!forAdmin ? '<p style="color:#a0967e;font-size:14px;line-height:1.6;">Our team will review your request and contact you within 2 business days to discuss pricing, delivery, and terms.</p>' : ''}
        
        <div style="border-top:1px solid #333;margin-top:32px;padding-top:16px;">
          <p style="margin:0;color:#5a5545;font-size:12px;">Silonka Premium Spices · ${new Date().getFullYear()}</p>
        </div>
      </div>
    </div>`;

    // Email to customer
    await transporter.sendMail({
        from: `"Silonka Spices" <${process.env.EMAIL_USER}>`,
        to: order.email,
        subject: `Bulk Order Received — Ref #${order._id.toString().slice(-8).toUpperCase()}`,
        html: emailTemplate(false),
    });

    // Email to admin
    if (process.env.ADMIN_EMAIL) {
        await transporter.sendMail({
            from: `"Silonka System" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `[NEW BULK ORDER] ${order.companyName} — Ref #${order._id.toString().slice(-8).toUpperCase()}`,
            html: emailTemplate(true),
        });
    }
};

// @desc    Create bulk order
// @route   POST /api/bulk-orders
// @access  Public
export const createBulkOrder = async (req, res) => {
    try {
        const { companyName, contactName, email, phone, products, notes } = req.body;
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'Please add at least one product' });
        }
        const order = await BulkOrder.create({ companyName, contactName, email, phone, products, notes });
        // Send emails async (don't block the response)
        sendBulkOrderEmails(order).catch(err => console.error('Email error:', err));
        res.status(201).json({ message: 'Bulk order submitted successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bulk orders
// @route   GET /api/bulk-orders
// @access  Private/Admin
export const getBulkOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const count = await BulkOrder.countDocuments();
        const orders = await BulkOrder.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
        
        res.json({ orders, page, pages: Math.ceil(count / limit), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete bulk order
// @route   DELETE /api/bulk-orders/:id
// @access  Private/Admin
export const deleteBulkOrder = async (req, res) => {
    try {
        const order = await BulkOrder.findById(req.params.id);
        if (order) {
            await BulkOrder.deleteOne({ _id: order._id });
            res.json({ message: 'Bulk order removed' });
        } else {
            res.status(404).json({ message: 'Bulk order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk delete bulk orders
// @route   DELETE /api/bulk-orders
// @access  Private/Admin
export const deleteBulkOrdersBulk = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No valid ids provided' });
        }
        await BulkOrder.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Bulk orders removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update bulk order status
// @route   PUT /api/bulk-orders/:id
// @access  Private/Admin
export const updateBulkOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await BulkOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Bulk order not found' });
        order.status = status;
        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
