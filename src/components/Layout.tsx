import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from './NavBar'
import { Footer } from './Footer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <NavBar />
      {/* single appear-fade slot per page */}
      <main key={pathname} className="appear flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
