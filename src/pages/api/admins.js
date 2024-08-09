import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Admin } from "../../../models/Admin";

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (req.method === 'POST') {
        try {
            const { email } = req.body;
            if (await Admin.findOne({email})){
                res.status(400).json({message:'already Exist'})
            }else{
                const newAdmin = await Admin.create({ email });
                res.status(201).json(newAdmin);
            }

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
        try {
            const { _id } = req.query; // Extracting ID from query parameters
            if (!_id) {
                return res.status(400).json({ error: 'ID is required' });
            }

            const result = await Admin.findByIdAndDelete(_id);

            if (!result) {
                return res.status(404).json({ error: 'Admin not found' });
            }

            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
