import React, { useCallback } from 'react';
import _ from 'lodash';
export default function SearchInput({ value, setValue, onInputClick, isSearching }) {

    const handleChange = (e: any) => {
        const value = e.target.value;
        setValue(value); // 更新内部状态
    };
    const throttledClick = useCallback(
        _.throttle(() => {
            onInputClick();
        }, 1000),
        [onInputClick]
    );

    return (
        <div style={{ display: 'flex', marginBottom: '20px' }}>
            {/* 搜索框 */}

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="请输入搜索关键词"
                style={{ marginRight: '10px' }}
            />
            <button onClick={throttledClick}>
                {isSearching ? '搜索中...' : '搜索'}
            </button>
        </div>
    );
}
