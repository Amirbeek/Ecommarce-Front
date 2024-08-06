import Layout from '../../src/pages/components/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';
import Spinner from "@/pages/components/Spinner";

// Define the Loading component
const Loading = () => (
    <div className="loading-container text-center">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
    </div>
);

function Categories({ swal }) {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([]);
    const [isEditingProperties, setIsEditingProperties] = useState(false);
    const [loading, setLoading] = useState(true); // State to manage loading indicator

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        setLoading(true); // Start loading indicator
        axios.get('/api/categories')
            .then(result => {
                setCategories(result.data);
                setLoading(false); // Turn off loading indicator once data is fetched
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('Error fetching categories');
                setLoading(false); // Make sure to turn off loading in case of error
            });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        if (!name.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        const formattedProperties = properties.map(p => ({
            name: p.name,
            values: p.values.split(','),
        }));

        try {
            if (editedCategory) {
                await axios.put('/api/categories', {
                    _id: editedCategory._id,
                    name,
                    parentCategory,
                    properties: formattedProperties
                });
            } else {
                await axios.post('/api/categories', {
                    name,
                    parentCategory,
                    properties: formattedProperties
                });
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Error saving category');
        }
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || '');
        setProperties(category.properties.map(p => ({
            name: p.name,
            values: p.values.join(',')
        })) || []);
        setIsEditingProperties(true);
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete this category? ${category.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { _id } = category;
                    await axios.delete('/api/categories?_id=' + _id);
                    fetchCategories();
                    swal.fire('Deleted!', 'Your category has been deleted.', 'success');

                } catch (error) {
                    console.error('Error deleting category:', error);
                    setError('Error deleting category');
                }
            }
        });
    }

    function addProperty() {
        setProperties(prev => [
            ...prev,
            {
                name: '',
                values: ''
            }
        ]);
        setIsEditingProperties(true);
    }

    function handlePropertyNameChange(index, newName) {
        setProperties(prev => {
            const updatedProperties = [...prev];
            updatedProperties[index].name = newName;
            return updatedProperties;
        });
    }

    function handlePropertyValuesChange(index, newValues) {
        setProperties(prev => {
            const updatedProperties = [...prev];
            updatedProperties[index].values = newValues;
            return updatedProperties;
        });
    }

    function removeProperty(indexRemove) {
        setProperties(prev => {
            const updatedProperties = prev.filter((_, pIndex) => pIndex !== indexRemove);
            setIsEditingProperties(updatedProperties.length > 0);
            return updatedProperties;
        });
    }

    function resetForm() {
        setName('');
        setParentCategory('');
        setProperties([]);
        setEditedCategory(null);
        setError('');
        setIsEditingProperties(false);
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label className="mt-2">
                {editedCategory ? (
                    <>Edit Category <strong>{editedCategory.name}</strong></>
                ) : "Create New Category"}
            </label>
            <form onSubmit={saveCategory}>
                <div className={'flex gap-1'}>
                    <input
                        type="text"
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                        className="mb-0"
                        placeholder="Category Name"
                    />
                    <select className={'mb-0'} value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                        <option value="">No Parent Category</option>
                        {categories.length > 0 && categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <div className="text-red-500 mt-1">{error}</div>}

                <div className={'mb-2 mt-2'}>
                    <label className={'block'}>Properties</label>
                    <button type={'button'} onClick={addProperty} className={'btn-default text-sm mt-1'}>Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className={'flex gap-1 mt-2'} key={index}>
                            <input
                                type="text"
                                value={property.name}
                                className={'mb-0'}
                                onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                                placeholder={'Property name (example: color)'}
                            />
                            <input
                                type="text"
                                className={'mb-0'}
                                value={property.values}
                                onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                                placeholder={'Values, comma separated'}
                            />
                            <button type="button" className={'btn-red text-sm'} onClick={() => removeProperty(index)}>Remove</button>
                        </div>
                    ))}
                </div>

                <div className={'flex gap-1'}>
                    {(isEditingProperties || editedCategory) && (
                        <button onClick={resetForm} type={'button'} className="btn-default p-1">Cancel</button>
                    )}
                    <button type="submit" className="btn-primary py-1">Save</button>
                </div>
            </form>

            {!properties.length && !editedCategory && (
                <>
                    <table className="basic mt-3">
                        <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3}>
                                    <div className="py-4">
                                        <Spinner fullWidth={true}/>
                                    </div>
                                </td>


                            </tr>
                        ) : (
                            categories.length > 0 && categories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name || ''}</td>
                                    <td>
                                        <button onClick={() => editCategory(category)} className=' btn-default  mr-1'>Edit</button>
                                        <button onClick={() => deleteCategory(category)} className=' btn-red' >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));
