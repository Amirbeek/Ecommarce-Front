import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import Layout from '../components/Layout';
import { useRouter } from 'next/router'; // Import useRouter

export default  function ProductForm(
    {
        title: existingTitle,
        description: existingDescription,
        price: existingPrice
    }
){

    const [title, setTitle] = useState(existingTitle);
    const [description, setDescription] = useState(existingDescription);
    const [price, setPrice] = useState(existingPrice);
    const [goToProduct, setGoToProduct] = useState(false);
    const router = useRouter(); // Use the useRouter hook

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);

    async function createProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price };
        try {
            await axios.post('/api/products', data); // Use axios here
            setGoToProduct(true);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    }

    if (goToProduct) {
        router.push('/products'); // Use router.push for redirection
        return null; // Return null to prevent rendering
    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1 className="text-blue-900 mb-2 text-xl">New Product</h1>
                <label htmlFor="title">Product name</label>
                <input
                    type="text"
                    id="title"
                    placeholder="Product name"
                    value={title}
                    onChange={handleTitleChange}
                />
                <label htmlFor="description">Product description</label>
                <textarea
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                />
                <label htmlFor="price">Product Price (in GPA)</label>
                <input
                    type="number"
                    id="price"
                    placeholder="Price"
                    value={price}
                    onChange={handlePriceChange}
                />
                <button type="submit" className="btn-primary">Save</button>
            </form>
        </Layout>
    );
}