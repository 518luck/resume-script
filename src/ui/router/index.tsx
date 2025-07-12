import { createBrowserRouter } from 'react-router-dom'

import App from '../App'
import Config from '../views/Config'
import Boss from '../views/Boss'
import Nowcoder from '../views/Nowcoder'
import AboutUs from '../views/AboutUs'
import Log from '../views/Log'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Config />,
      },
      {
        path: '/config',
        element: <Config />,
      },
      {
        path: '/boss',
        element: <Boss />,
      },
      {
        path: '/nowcoder',
        element: <Nowcoder />,
      },
      {
        path: '/about',
        element: <AboutUs />,
      },
      {
        path: '/logs',
        element: <Log />,
      },
    ],
  },
])

export default router
