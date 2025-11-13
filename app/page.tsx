import { FAQ } from '@/components/ui/web/faq'
import { Footer } from '@/components/ui/web/footer'
import { Hero } from '@/components/ui/web/hero'
import { Navbar } from '@/components/ui/web/navbar'

const HomePage = () => {
  return (
    <div className='min-h-screen'> {/* Remove flex and justification */}
      <Navbar/>
      <main>
        <Hero/>
        <FAQ/>
      </main>
      <Footer/>
    </div>
  )
}

export default HomePage