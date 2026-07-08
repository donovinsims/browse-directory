import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { BookmarksProvider } from './providers/BookmarksProvider'
import { ToastProvider } from './providers/ToastProvider'
import { Layout } from './components/Layout'
import { Gallery } from './pages/Gallery'
import { SiteDetail } from './pages/SiteDetail'
import { Pricing } from './pages/Pricing'
import { Submit } from './pages/Submit'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Bookmarks } from './pages/Bookmarks'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Account } from './pages/Account'
import { Admin } from './pages/Admin'
import { StartHere } from './pages/StartHere'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookmarksProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Gallery />} />
                <Route path="/category/:slug" element={<Gallery />} />
                <Route path="/site/:slug" element={<SiteDetail />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/start-here-delete-later" element={<StartHere />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BookmarksProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
