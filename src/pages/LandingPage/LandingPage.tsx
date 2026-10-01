import { Navbar } from '../../components/Navbar/Navbar'
import { ScrollProgressBar } from '../../components/ScrollProgressBar/ScrollProgressBar'
import { HeroSequence } from '../../components/HeroSequence/HeroSequence'
import { ModuleCard } from '../../components/ModuleCard/ModuleCard'
import { labModules } from '../../modules/registry'
import { Link } from '../../routing/Link'
import './LandingPage.css'

const availableCount = labModules.filter((module) => module.status === 'disponible').length

export function LandingPage() {
  return (
    <div className="landing">
      <ScrollProgressBar />
      <Navbar />

      <main>
        <HeroSequence />

        <section id="enfoques" className="approaches">
          <h2>{availableCount} módulos, un mismo lanzamiento</h2>
          <p className="approaches__intro">
            Cada módulo analiza el mismo tiro desde un ángulo distinto — física, geometría,
            representación técnica, resultados e inteligencia artificial — y se apoya en los
            anteriores en vez de repetir su trabajo.
          </p>
          <div className="approaches__grid">
            {labModules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Simulación y análisis del tiro a canasta mediante modelos físicos, geométricos e
          inteligencia artificial. Trabajo de investigación de Bachillerato.
        </p>
        <p className="footer__byline">
          Jorge Ardura Ibáñez · Colegio Valdefuentes · 2026 · <Link to="/sobre-el-proyecto">Sobre el proyecto</Link>
        </p>
      </footer>
    </div>
  )
}
