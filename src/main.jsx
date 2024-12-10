
import { createRoot } from 'react-dom/client'
// 使用 Suspense 包裹组件
import { Suspense } from 'react'
import './index.css'
import App from './App.tsx'
createRoot(document.getElementById('root')).render(
  <Suspense fallback={<div>ldw加载李大卫...</div>}>
    <App />
  </Suspense>
)
