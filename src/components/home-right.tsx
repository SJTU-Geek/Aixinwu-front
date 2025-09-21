import { Typography } from "antd";
import React, { useState, useEffect, useContext } from "react";
import ProductGrid from "@/components/product-grid";
import { ProductSummary } from "@/models/products";
import BasicCard from "@/components/basic-card";
import AuthContext from '@/contexts/auth';
import { fetchProductsByCollection } from "@/services/product";

const { Link } = Typography;

export const HomeRightContent = () => {

    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const [hotProducts, setHotProducts] = useState<ProductSummary[] | null>(null);
    const [hotSharedProducts, setHotSharedProducts] = useState<ProductSummary[] | null>(null);
    const [specialDiscountProducts, setSpecialDiscountProducts] = useState<ProductSummary[] | null>(null);

    useEffect(() => {
        fetchProductsByCollection(client!, process.env.NEXT_PUBLIC_CHANNEL!, 12, 'hot-products')
            .then(products => setHotProducts(products));
        fetchProductsByCollection(client!, process.env.NEXT_PUBLIC_CHANNEL2!, 12, 'hot-products')
            .then(products => setHotSharedProducts(products));
    }, []);

    useEffect(() => {
        if (authCtx.userInfo?.is_poor) {
            fetchProductsByCollection(client!, process.env.NEXT_PUBLIC_CHANNEL!, 12, 'special-discount-area')
                .then(products => setSpecialDiscountProducts(products));
        }
    }, [authCtx.userInfo]);

    return (
        <>
            { specialDiscountProducts && 
                <BasicCard title="特殊折扣专区" divider>
                    <ProductGrid products={specialDiscountProducts} />
                </BasicCard>
            }
            <BasicCard title="热门置换" divider
                titleExtra={
                    <Link href={"/products/"+process.env.NEXT_PUBLIC_CHANNEL} >{'全部>>'}</Link>
                }
                >
                <ProductGrid products={hotProducts || []} />
            </BasicCard>
            <BasicCard title="热门租赁" divider
                titleExtra={
                    <Link href={"/products/"+process.env.NEXT_PUBLIC_CHANNEL2} >{'全部>>'}</Link>
                }
                >
                <ProductGrid products={hotSharedProducts || []} />
            </BasicCard>
        </>
    )
}