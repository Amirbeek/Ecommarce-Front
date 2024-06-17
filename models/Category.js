import mongoose, { Schema, model, models } from 'mongoose';
import { mongooseConnect } from "../lib/mongoose";


const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: [{type:Object}]
});

export const Category = models?.Category || model('Category', CategorySchema);
