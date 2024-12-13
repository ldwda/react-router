import React, { useCallback } from 'react';
import _ from 'lodash';

export default function SearchInput({ category, onSearchClick }) {
    const throttledOnCategory = useCallback(
        _.throttle((item: string) => {
            onSearchClick(item);
        }, 1000),
        [onSearchClick]
    );
    return (
        <div style={{ display: 'flex', marginBottom: '20px' }}>
            {['all', 'Category 0', 'Category 1', 'Category 2'].map((item) => (
                <button
                    key={item}
                    onClick={() => throttledOnCategory(item)}
                    style={{
                        marginRight: '10px',
                        backgroundColor: category === item ? '#1890ff' : '#f0f0f0',
                        color: category === item ? '#fff' : '#000',
                    }}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
