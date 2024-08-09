import Layout from "@/pages/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/pages/components/Spinner";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
    const [products, setProducts] = useState([]);
    const [featuredProductId, setFeaturedProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shippingFee, setShippingFee] = useState('');

    useEffect(() => {
        fetchAll().then(() => {
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        });
    }, []);

    async function fetchAll() {
        const productsRes = await axios.get('/api/products');
        setProducts(productsRes.data);

        const settingRes = await axios.get('/api/settings?name=featuredProductId');
        setFeaturedProductId(settingRes.data?.value || "");

        const shippingFeeRes = await axios.get('/api/settings?name=shippingFee');
        setShippingFee(shippingFeeRes.data?.value || '');
    }

    const saveSettings = async () => {
        try {
            setIsLoading(true);

            await axios.put('/api/settings', {
                name: 'featuredProductId',
                value: featuredProductId
            });
            await axios.put('/api/settings', {
                name: 'shippingFee',
                value: shippingFee
            });
            setIsLoading(false);

            await swal.fire({
                title: 'Settings saved!',
                icon: 'success'
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            await swal.fire({
                title: 'Error saving settings',
                text: error.message,
                icon: 'error'
            });
        }
    };

    return (
        <Layout>
            <h1>Store Settings</h1>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <label>Featured Product</label>
                    <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                        <option value="">Select a product</option>
                        {products.map(product => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <label>Shipping price (in GBP)</label>
                    <input type="number" value={shippingFee} onChange={ev => setShippingFee(ev.target.value)} />
                    <div>
                        <button className="btn-primary" onClick={saveSettings}>Save Settings</button>
                    </div>
                </>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }) => (
    <SettingsPage swal={swal} />
));
