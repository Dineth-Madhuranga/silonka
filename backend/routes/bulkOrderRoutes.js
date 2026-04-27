import express from 'express';
import { 
    createBulkOrder, 
    getBulkOrders, 
    updateBulkOrderStatus,
    deleteBulkOrder,
    deleteBulkOrdersBulk
} from '../controllers/bulkOrderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(createBulkOrder)
    .get(protect, admin, getBulkOrders)
    .delete(protect, admin, deleteBulkOrdersBulk);
router.route('/:id')
    .put(protect, admin, updateBulkOrderStatus)
    .delete(protect, admin, deleteBulkOrder);

export default router;
