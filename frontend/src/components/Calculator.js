import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function Calculator() {
    useEffect( () => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);
    const fetchItems = async() => {
        const data = await fetch('/calculator');
        const items = await data.json();
        setItems(items);
    }

    return(
        <section>
            {
                items.map(item => (
                    <div>
                        <p>{item.name}</p>
                        <p>{item.pts}</p>
                        <p>{item.ast}</p>
                    </div>
                ))
            }
        </section>
    );
}

export default Calculator;