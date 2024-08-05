import Layout from "@/pages/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';

export default function OrderPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the orders!", error);
            });
    }, []);

    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                <tr>
                    <th>Order Date</th>
                    <th>Paid</th>
                    <th>Recipient</th>
                    <th>Products</th>

                </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
                    <tr key={order._id}>
                        <td>
                            {order.createdAt ? (
                                <>
                                    {format(new Date(order.createdAt), 'dd/MM/yyyy')}<br />
                                    {format(new Date(order.createdAt), 'HH:mm:ss')}
                                </>
                            ) : "Date not available"}
                        </td>
                        <td  className={order.paid ? ' text-center text-green-600' : 'text-center text-red-600'}>
                            {order.paid ? "Yes" : "No"}
                        </td>
                        <td>
                            {order.name}, {order.email}<br/>
                            {order.postalCode}, {order.country}<br/>
                            {order.streetAddress}
                        </td>
                        <td>
                            {order.line_items.map((item, index) => (
                                <div key={index}>
                                    {item.price_data?.product_data.name} x {item.quantity} <br/>
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    );
}
