import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SmoothScroll } from './components/SmoothScroll'
import { ScrollStory } from './components/ScrollStory'

export default function App() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <ScrollStory />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
