import Header from './components/Header'
import Footer from './components/Footer'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto p-6">{children}</main>
      <Footer />
    </div>
  )
}
