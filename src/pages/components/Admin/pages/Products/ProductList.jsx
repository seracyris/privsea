import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uptime, setUptime] = useState(null);
    const [form, setForm] = useState({
        name: '',
        location: '',
        type: '',
        slots: '',
        flagUrl: '',
        priceId: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [flagFile, setFlagFile] = useState(null); // Added state for flag file

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:1337/servers'); // Replace with your API endpoint
                console.log("Products fetched: ", response.data); // Debug statement
                setProducts(response.data.servers || []); // Adjust if the response is nested
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchUptime = async () => {
            try {
                const response = await axios.get('http://or.privsea.net:5000/uptime');
                console.log("Uptime fetched: ", response.data); // Debug statement
                setUptime(response.data);
            } catch (err) {
                setUptime('0');
            }
        };

        fetchUptime();
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFlagFileChange = (e) => {
        setFlagFile(e.target.files[0]);
    };

    const handleAddProduct = async () => {
        try {
            const formData = new FormData();
            for (const key in form) {
                formData.append(key, form[key]);
            }
            if (flagFile) {
                formData.append('flagFile', flagFile);
            }

            const response = await axios.post('http://localhost:1337/servers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProducts([...products, response.data]);
            setForm({
                name: '',
                location: '',
                type: '',
                slots: '',
                flagUrl: '',
                priceId: '',
            });
            setFlagFile(null); // Reset flag file input
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setEditingProductId(product._id);
        setForm({
            name: product.name,
            location: product.location,
            type: product.type,
            slots: product.slots,
            flagUrl: product.flagUrl,
            priceId: product.plans[0]?.priceId || '',
        });
    };

    const handleUpdateProduct = async () => {
        try {
            const formData = new FormData();
            for (const key in form) {
                formData.append(key, form[key]);
            }
            if (flagFile) {
                formData.append('flagFile', flagFile);
            }

            const response = await axios.put(`http://localhost:1337/servers/${editingProductId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const updatedProducts = products.map((product) =>
                product._id === editingProductId ? response.data : product
            );
            setProducts(updatedProducts);
            setIsEditing(false);
            setEditingProductId(null);
            setForm({
                name: '',
                location: '',
                type: '',
                slots: '',
                flagUrl: '',
                priceId: '',
            });
            setFlagFile(null); // Reset flag file input
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:1337/servers/${productId}`);
            setProducts(products.filter((product) => product._id !== productId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center text-neutral-100">
            <table className="min-w-full mb-10 bg-slate-900">
                <thead>
                    <tr className="bg-slate-900">
                        <th className="py-2 px-4">Product ID</th>
                        <th className="py-2 px-4">Product Name</th>
                        <th className="py-2 px-4">Product Location</th>
                        <th className="py-2 px-4">Product Type</th>
                        <th className="py-2 px-4">Uptime</th>
                        <th className="py-2 px-4">Available</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="hover:bg-slate-600">
                            <td className="py-2 px-4">{product._id}</td>
                            <td className="py-2 px-4">{product.name}</td>
                            <td className="py-2 px-4">{product.location}</td>
                            <td className="py-2 px-4">{product.type}</td>
                            <td className="py-2 px-4">{uptime}</td>
                            <td className="py-2 px-4">{product.slots}/200</td>
                            <td className="flex space-x-2 py-2 px-4">
                                <button
                                    className="bg-blue-500 text-neutral-100 px-2 py-1 rounded"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-neutral-100 px-2 py-1 rounded"
                                    onClick={() => handleDeleteProduct(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="w-full max-w-3xl">
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                <form className="bg-slate-900 text-neutral-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-4">
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="location">
                            Location
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="location"
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="type">
                            Type
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="type"
                            name="type"
                            type="text"
                            value={form.type}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="slots">
                            Slots
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="slots"
                            name="slots"
                            type="number"
                            value={form.slots}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="flagUrl">
                            Flag URL (Optional)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="flagUrl"
                            name="flagUrl"
                            type="text"
                            value={form.flagUrl}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="flagFile">
                            Flag File (Optional)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="flagFile"
                            name="flagFile"
                            type="file"
                            onChange={handleFlagFileChange}
                        />
                    </div>
                    <div className="mb-4 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold mb-2" htmlFor="priceId">
                            Price ID
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-slate-700 text-neutral-100"
                            id="priceId"
                            name="priceId"
                            type="text"
                            value={form.priceId}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                        <button
                            className="bg-indigo-500 hover:bg-indigo-700 text-neutral-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={isEditing ? handleUpdateProduct : handleAddProduct}
                        >
                            {isEditing ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductList;
