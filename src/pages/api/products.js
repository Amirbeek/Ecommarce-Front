import { mongooseConnect } from "../../../lib/mongoose";
import { Product } from "../../../models/Product";
import { authOptions, isAdminRequest } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    try {
        await isAdminRequest(req, res);
    } catch (error) {
        console.error('Admin check failed:', error);
        return res.status(401).json({ error: 'Not admin' });
    }

    switch (method) {
        case 'POST':
            try {
                const { title, description, price, images, category, properties } = req.body;
                const productDoc = await Product.create({ title, description, price, images, category, properties });
                res.status(201).json(productDoc);
            } catch (error) {
                console.error('Error creating product:', error);
                res.status(500).json({ error: 'Error creating product', details: error.message });
            }
            break;

        case 'GET':
            try {
                if (req.query?.id) {
                    const product = await Product.findById(req.query.id);
                    res.status(200).json(product);
                } else {
                    const products = await Product.find();
                    res.status(200).json(products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Error fetching products', details: error.message });
            }
            break;

        case 'PUT':
            try {
                const { _id, title, description, price, images, category, properties } = req.body;
                const productDoc = await Product.findByIdAndUpdate(_id, { title, description, price, images, category, properties }, { new: true });
                res.status(200).json(productDoc);
            } catch (error) {
                console.error('Error updating product:', error);
                res.status(500).json({ error: 'Error updating product', details: error.message });
            }
            break;

        case 'DELETE':
            try {
                if (req.query?.id) {
                    await Product.findByIdAndDelete(req.query.id);
                    res.status(200).json({ message: 'Product deleted successfully' });
                } else {
                    res.status(400).json({ error: 'Missing ID' });
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).json({ error: 'Error deleting product', details: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
