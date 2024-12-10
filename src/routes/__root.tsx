import * as React from 'react'
import { Link, Outlet, createRootRouteWithContext, } from '@tanstack/react-router'

import { AuthContext } from "../hooks/useAuth";
type RouterContext = {
    authentication: AuthContext;
};
export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <h1>My App</h1>
            <ul>
                {/* <li>
                    <Link to="/" activeProps={{ style: { fontWeight: 'bold' } }}>Home</Link>
                </li>
                <li>
                    <Link to="/profile" activeProps={{ style: { fontWeight: 'bold' } }}>Profile</Link>
                </li> */}
                <li>
                    <Link to="/list" activeProps={{ style: { fontWeight: 'bold' } }}>list</Link>
                </li>
                {/* <Link
                    to="/search"
                    activeProps={{ style: { fontWeight: 'bold' } }}
                    search={{
                        query: 'hello',
                        hasDiscount: true,
                        categories: ['electronics', 'clothing'],
                    }}
                >
                    Search
                </Link> */}
            </ul>
            <Outlet />
        </>
    ),
});


