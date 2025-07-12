import { createBrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import React from 'react'

import App from '../App'

const Config = React.lazy(() => import('../views/Config'))
const Boss = React.lazy(() => import('../views/Boss'))
const Nowcoder = React.lazy(() => import('../views/Nowcoder'))
const AboutUs = React.lazy(() => import('../views/AboutUs'))
const Log = React.lazy(() => import('../views/Log'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true, // 使用index而不是path: '/'
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Config />
          </Suspense>
        ),
      },
      {
        path: '/config',
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Config />
          </Suspense>
        ),
      },
      {
        path: '/boss',
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Boss />
          </Suspense>
        ),
      },
      {
        path: '/nowcoder',
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Nowcoder />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: '/logs',
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Log />
          </Suspense>
        ),
      },
    ],
  },
])

export default router
