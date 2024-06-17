import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout'; // Adjust the import path as needed

export default function Delete(){
    const router = useRouter();
    const {id} = router.query;
    const [productInfo,setProductInfo] = useState();
    console.log(id)
    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response =>{
            setProductInfo(response.data);
        })
    },[id])

    function GoBack() {
        router.push('/products')
    }
    async function deleteProduct() {
        await axios.delete('/api/products?id='+id);
        GoBack();
    }

    return(
        <Layout>
            <h1 className={'text-center'}>Do You really want to delete
                &nbsp; "{productInfo?.title}"?</h1>

            <div className={"flex gap-2 justify-center"}>
                <button className="btn-red" onClick={deleteProduct}>Yes</button>
                <button onClick={GoBack} className={'btn-default'}>No</button>
            </div>
        </Layout>
    );
}