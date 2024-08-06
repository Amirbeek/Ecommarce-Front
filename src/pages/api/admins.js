import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Admin } from "../../../models/Admin";

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (req.method === 'POST') {
        try {
            const { email } = req.body;
            const newAdmin = await Admin.create({ email });
            res.status(201).json(newAdmin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'GET') {
        try {
            const admins = await Admin.find({});
            res.status(200).json(admins);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        const { _id } = req.query;
        try {
            await Admin.findByIdAndDelete(_id);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
