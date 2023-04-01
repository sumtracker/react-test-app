import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { SearchByContact } from "./components/contacts.list";
import ProductsTable from "./components/products.table";


const fixedListParams = {
    paginate: true
}

const ProductList: FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const contact = searchParams.get('contact');
    const page = parseInt(searchParams.get('page') as string) || 1;

    const incrementPage = () => { setSearchParams({ ...searchParams, "page": String(page + 1) }); }
    const decrementPage = () => { setSearchParams({ ...searchParams, "page": String(page - 1) }); }

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoding] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginateDataType>({
        next: null,
        prev: null,
        count: null,
        resultsCount: 0,
        offset: null,
        hasOffset: true,
        limit: PAGINATION_LIMIT
    });


    useEffect(() => {
        init();
    }, [contact, page]);

    const init = async () => {
        const offset = (page - 1) * PAGINATION_LIMIT;
        const queryParams = { contact, offset };
        loadProducts(queryParams);
    }

    const loadProducts = async (queryParams?: Record<string, any>) => {
        let query = queryParams || {};
        setLoding(true);
        try {
            const res = await listProducts({
                query: { ...fixedListParams, ...query }
            });

            setProducts(res.data.results);
            setPagination(prev => {
                return {
                    ...prev,
                    next: res.data.next,
                    prev: res.data.previous,
                    count: res.data.count,
                    resultsCount: res.data.results.length,
                    offset: query?.offset ? Number(query.offset) : null,
                }
            });

        } catch (err) {
            console.log(err);
        }
        setLoding(false);
    }

    return (
        <>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Heading
                    titleLevel={2}
                >
                    Products
                </Heading>
                <SearchByContact />
            </div>
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '0.5rem',
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <ResultString
                                loading={loading}
                                pagination={pagination}
                                pageString={'product'}
                            />
                        </div>
                        <div>
                            <Pagination
                                loading={loading}
                                next={pagination.next}
                                prev={pagination.prev}
                                onNextClick={incrementPage}
                                onPrevClick={decrementPage}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <ProductsTable
                        list={products}
                        loading={loading}
                    />
                </div>
                <div>
                    <Pagination
                        loading={loading}
                        next={pagination.next}
                        prev={pagination.prev}
                        onNextClick={incrementPage}
                        onPrevClick={decrementPage}
                    />
                </div>
            </div>
        </>)
}

export default ProductList;