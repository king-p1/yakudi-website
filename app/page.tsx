import { FAQ } from '@/components/ui/web/faq'
import { Footer } from '@/components/ui/web/footer'
import { Hero } from '@/components/ui/web/hero'
import { Navbar } from '@/components/ui/web/navbar'
import { PromoVideoDialog } from '@/components/ui/web/promo-video-dialog'

const HomePage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <main className='flex-1'>
        <Hero/>
        <FAQ/>
        <PromoVideoDialog/>
      </main>
      <Footer/>
    </div>
  )
}

export default HomePage