import { Category } from "../../../models/Category";
import { mongooseConnect } from "../../../lib/mongoose";
import { authOptions, isAdminRequest } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handle(req, res) {
    await mongooseConnect();
    try {
        await isAdminRequest(req, res); // Ensuring admin check
    } catch (error) {
        console.error('Admin check failed:', error);
        return res.status(401).json({ error: 'Not admin' });
    }

    const { method } = req;
    const session = await getServerSession(req, res, authOptions);
    console.log(session);

    switch (method) {
        case "POST":
            try {
                const { name, parentCategory, properties } = req.body;
                if (!name) {
                    return res.status(400).json({ error: "Name is required" });
                }
                const categoryDoc = await Category.create({
                    name,
                    parent: parentCategory || null,
                    properties
                });
                res.status(201).json(categoryDoc);
            } catch (error) {
                console.error("Error creating category:", error);
                res.status(500).json({ error: "Internal server error" });
            }
            break;

        case "GET":
            try {
                const categories = await Category.find().populate('parent');
                res.status(200).json(categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                res.status(500).json({ error: "Internal server error" });
            }
            break;

        case "PUT":
            try {
                const { _id, name, parentCategory, properties } = req.body;
                if (!name) {
                    return res.status(400).json({ error: "Name is required" });
                }
                const categoryDoc = await Category.updateOne({ _id }, {
                    name,
                    parent: parentCategory || null,
                    properties
                });
                res.status(200).json(categoryDoc);
            } catch (error) {
                console.error("Error updating category:", error);
                res.status(500).json({ error: "Internal server error" });
            }
            break;

        case "DELETE":
            try {
                const { _id } = req.query;
                await Category.deleteOne({ _id });
                res.json('ok');
            } catch (error) {
                console.error("Error deleting category:", error);
                res.status(500).json({ error: "Internal server error" });
            }
            break;

        default:
            res.status(405).json({ error: "Method not allowed" });
            break;
    }
}
