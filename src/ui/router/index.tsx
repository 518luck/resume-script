import { createHashRouter, Navigate } from 'react-router-dom'
import React, { Suspense } from 'react'
import { Empty } from 'antd'

import App from '../App'

const Config = React.lazy(() => import('../views/Config'))
const Boss = React.lazy(() => import('../views/Boss'))
const Nowcoder = React.lazy(() => import('../views/Nowcoder'))
const AboutUs = React.lazy(() => import('../views/AboutUs'))
const Log = React.lazy(() => import('../views/Log'))

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to='/config' replace />,
      },
      {
        path: '/config',
        element: (
          <Suspense fallback={<Empty />}>
            <Config />
          </Suspense>
        ),
      },
      {
        path: '/boss',
        element: (
          <Suspense fallback={<Empty />}>
            <Boss />
          </Suspense>
        ),
      },
      {
        path: '/nowcoder',
        element: (
          <Suspense fallback={<Empty />}>
            <Nowcoder />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<Empty />}>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: '/logs',
        element: (
          <Suspense fallback={<Empty />}>
            <Log />
          </Suspense>
        ),
      },
    ],
  },
])

export default router
