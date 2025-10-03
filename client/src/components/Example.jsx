// simple example component to see if the React setup is working





import React, { useEffect, useState } from 'react';
import { fetchExampleData } from '../services/api';


const Example = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExampleData()
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch data');
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>Example Data from API</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data && <pre>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default Example;