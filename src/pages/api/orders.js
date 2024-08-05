import { mongooseConnect } from "../../../lib/mongoose";
import { Order } from "../../../models/Order";

export default async function handler(req, res) {
    try {
        await mongooseConnect();
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
}
