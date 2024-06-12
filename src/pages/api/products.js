import { mongooseConnect } from "../../../lib/mongoose";
import { Product } from "../../../models/Product";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'POST') {
        const { title, description, price } = req.body;
        try {
            const productDoc = await Product.create({ title, description, price });
            res.json(productDoc);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Error creating product', details: error.message });
        }
    }
    if (method === 'GET') {
        if (req.query?.id) {
            const product = await Product.findOne({ _id: req.query.id });
            console.log('Product found:', product);
            res.json(product);
        }else{
            res.json(await Product.find());
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

}
