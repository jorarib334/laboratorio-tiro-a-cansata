import { LandingPage } from './pages/LandingPage/LandingPage'
import { AboutPage } from './modules/about/AboutPage'
import { AiPage } from './modules/ai/AiPage'
import { GeometryPage } from './modules/geometry/GeometryPage'
import { PhysicsPage } from './modules/physics/PhysicsPage'
import { ResultsPage } from './modules/results/ResultsPage'
import { TechnicalPage } from './modules/technical/TechnicalPage'
import { useRoute } from './routing/useRoute'

function App() {
  const path = useRoute()

  if (path === '/fisica') return <PhysicsPage />
  if (path === '/geometria') return <GeometryPage />
  if (path === '/representacion-tecnica') return <TechnicalPage />
  if (path === '/resultados') return <ResultsPage />
  if (path === '/ia') return <AiPage />
  if (path === '/sobre-el-proyecto') return <AboutPage />
  return <LandingPage />
}

export default App
