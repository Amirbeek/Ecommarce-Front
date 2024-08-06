import Layout from "@/pages/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Spinner from "@/pages/components/Spinner";
import { prettyDate } from "../../lib/date";

function AdminPage({ swal }) {
    const [email, setEmail] = useState('');
    const [adminEmails, setAdminEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function AddAdmin(ev) {
        ev.preventDefault();
        setIsLoading(true);
        axios.post('/api/admins', { email })
            .then(res => {
                swal.fire({
                    title: 'Admin created',
                    icon: 'success'
                });
                setEmail('');
                fetchAdmins();
            })
            .catch(error => {
                console.error(error);
                swal.fire({
                    title: 'Error',
                    text: 'Failed to create admin',
                    icon: 'error'
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function deleteAdmin(_id, email) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete ${email}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete(`/api/admins?_id=${_id}`)
                    .then(() => {
                        swal.fire({
                            title: 'Admin deleted',
                            icon: 'warning'
                        });
                        fetchAdmins();
                    })
                    .catch(error => {
                        console.error(error);
                        swal.fire({
                            title: 'Error',
                            text: error.response?.data?.error || 'Failed to delete admin',
                            icon: 'error'
                        });
                    });
            }
        });
    }

    function fetchAdmins() {
        setIsLoading(true);
        axios.get('/api/admins')
            .then(res => {
                setAdminEmails(res.data);
            })
            .catch(error => {
                console.error(error);
                swal.fire({
                    title: 'Error',
                    text: 'Failed to fetch admins',
                    icon: 'error'
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <Layout>
            <h1>Admins</h1>
            <h2>Add new admin</h2>
            <form onSubmit={AddAdmin}>
                <div className="flex gap-2">
                    <input
                        type="email"
                        className="mb-0"
                        placeholder="Add Google email"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        required
                    />
                    <button className="btn-primary py-1 whitespace-nowrap" type="submit">
                        Add Admin
                    </button>
                </div>
            </form>
            <h2>Existing Admins</h2>
            <table className="basic">
                <thead>
                <tr>
                    <th className="text-left">Admin Email</th>
                    <th className="text-left">Created At</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={3}>
                            <div className="py-4">
                                <Spinner fullWidth={true} />
                            </div>
                        </td>
                    </tr>
                ) : (
                    adminEmails.length > 0 ? (
                        adminEmails.map((admin) => (
                            <tr key={admin._id}>
                                <td>{admin.email}</td>
                                <td>{admin.createdAt && prettyDate(admin.createdAt)}</td>
                                <td>
                                    <button className='btn-red' onClick={() => deleteAdmin(admin._id, admin.email)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No admins found</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }) => <AdminPage swal={swal} />);
