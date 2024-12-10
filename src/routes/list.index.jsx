import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/list/')({
    component: RouteComponent,
})

function RouteComponent() {
    return '默认内容!'
}
