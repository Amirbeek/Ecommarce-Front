import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
                                        _id,
                                        title: existingTitle,
                                        description: existingDescription,
                                        price: existingPrice,
                                        images: existingImages,
                                        category: existingCategory,
                                        properties: assignedProperties
                                    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProduct, setGoToProduct] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(existingCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, []);

    useEffect(() => {
        setTitle(existingTitle || '');
        setDescription(existingDescription || '');
        setPrice(existingPrice || '');
        setImages(existingImages || []);
        setSelectedCategory(existingCategory || '');
        setProductProperties(assignedProperties || {});
    }, [existingTitle, existingDescription, existingPrice, existingImages, existingCategory, assignedProperties]);

    useEffect(() => {
        if (goToProduct) {
            router.push('/products');
        }
    }, [goToProduct, router]);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            category: selectedCategory || null,
            properties: productProperties
        };
        try {
            if (_id) {
                await axios.put('/api/products', { ...data, _id });
            } else {
                await axios.post('/api/products', data);
            }
            setGoToProduct(true);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    async function uploadImage(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }

            try {
                const res = await axios.post('/api/upload', data);
                setImages(oldImages => [...oldImages, ...res.data.links]);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
            setIsUploading(false);
        }
    }

    function updateImagesOrder(newImages) {
        setImages(newImages);
    }

    const propertiesFill = [];
    if (selectedCategory) {
        let catInfo = categories.find(({ _id }) => _id === selectedCategory);
        while (catInfo) {
            if (catInfo.properties) {
                propertiesFill.push(...catInfo.properties);
            }
            catInfo = catInfo.parent ? categories.find(({ _id }) => _id === catInfo.parent._id) : null;
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    return (
        <form onSubmit={saveProduct}>
            <label htmlFor="title">Product name</label>
            <input
                type="text"
                id="title"
                placeholder="Product name"
                value={title}
                onChange={handleTitleChange}
            />
            <label>Categories</label>
            <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesFill.length > 0 && propertiesFill.map((p, index) => (
                <div className={'1'} key={index}>
                    <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                    <div>
                        <select type="text" value={productProperties[p.name] || ''} onChange={ev => setProductProp(p.name, ev.target.value)}>
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>Photos</label>
            <div className="mb-2 flex gap-1">
                <ReactSortable list={images} setList={updateImagesOrder} className={'flex flex-wrap gap-1'}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className={'  shadow-sm rounded-sm bg-white border border-gray-100'}>
                            <img src={link} className={'rounded-lg h-24 cursor-pointer'} />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className={'h-24 bg-gray-200 p-1 flex items-center'}>
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 p-4 cursor-pointer rounded-lg border-gray-400 flex shadow-sm bg-white text-center items-center flex-col justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add Image</div>
                    <input type="file" className="hidden" onChange={uploadImage} />
                </label>
            </div>
            <label htmlFor="description">Product description</label>
            <textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={handleDescriptionChange}
            />
            <label htmlFor="price">Product Price (in GBP)</label>
            <input
                type="number"
                id="price"
                placeholder="Price"
                value={price}
                onChange={handlePriceChange}
            />
            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}
