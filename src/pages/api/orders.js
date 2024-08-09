import { mongooseConnect } from "../../../lib/mongoose";
import { Order } from "../../../models/Order";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    try {
        await mongooseConnect();
        await isAdminRequest(req,res);
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
}
