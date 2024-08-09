import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Setting } from "../../../models/Setting";

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (req.method === "PUT") {
        const { name, value } = req.body;
        const settingsDoc = await Setting.findOne({ name });
        if (settingsDoc) {
            settingsDoc.value = value;
            await settingsDoc.save();
            res.json(settingsDoc);
        } else {
            res.json(await Setting.create({ name, value }));
        }
    } else if (req.method === "GET") {
        const { name } = req.query;
        const setting = await Setting.findOne({ name });
        res.json(setting);
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
