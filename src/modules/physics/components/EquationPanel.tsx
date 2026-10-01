import './EquationPanel.css'

/**
 * Ecuaciones exactamente como están definidas en
 * `.claude/skills/laboratorio-tiro-canasta/SKILL.md` §4. La forma y(x) es
 * la trayectoria: se obtiene despejando t = x / (V₀·cos θ) en x(t) y
 * sustituyendo en y(t) — álgebra sobre las mismas ecuaciones, no una
 * fórmula nueva.
 */
export function EquationPanel() {
  return (
    <div className="equation-panel">
      <p className="equation-panel__eyebrow">Modelo · movimiento parabólico, sin resistencia del aire</p>

      <div className="equation-panel__groups">
        <div className="equation-panel__group">
          <h4>Posición</h4>
          <p className="equation-panel__eq">x(t) = V₀·cos(θ)·t</p>
          <p className="equation-panel__eq">y(t) = y₀ + V₀·sen(θ)·t − ½·g·t²</p>
        </div>

        <div className="equation-panel__divider" aria-hidden="true" />

        <div className="equation-panel__group">
          <h4>Velocidad</h4>
          <p className="equation-panel__eq">vₓ(t) = V₀·cos(θ)</p>
          <p className="equation-panel__eq">vᵧ(t) = V₀·sen(θ) − g·t</p>
        </div>

        <div className="equation-panel__divider" aria-hidden="true" />

        <div className="equation-panel__group">
          <h4>Trayectoria</h4>
          <p className="equation-panel__eq">y(x) = y₀ + x·tan(θ) − g·x² / (2·V₀²·cos²θ)</p>
          <p className="equation-panel__note">Misma ecuación que x(t)/y(t), eliminando el tiempo.</p>
        </div>
      </div>
    </div>
  )
}
