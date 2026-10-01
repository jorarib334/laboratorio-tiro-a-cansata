import { CIRCLE_RELATION_CONDITIONS, CIRCLE_RELATION_LABELS } from '../../../geometry/circleRelations'
import type { CircleRelation } from '../../../geometry/types'
import './RelationReference.css'

const HOOP_R = 26
const BALL_R = 16
const HOOP_X = 64
const CY = 38

/** Posición horizontal esquemática del balón para ilustrar cada caso (no son valores reales, solo una referencia visual fija). */
const BALL_X: Record<CircleRelation, number> = {
  exterior: 15,
  'tangent-exterior': HOOP_X - (HOOP_R + BALL_R),
  secant: HOOP_X - 27,
  'tangent-interior': HOOP_X - (HOOP_R - BALL_R),
  interior: HOOP_X - 5,
  concentric: HOOP_X,
}

const ORDER: CircleRelation[] = ['exterior', 'tangent-exterior', 'secant', 'tangent-interior', 'interior', 'concentric']

/** Balón reconocible (relleno + costuras), no un círculo genérico. */
function BallIcon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const scale = r / 11
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle r={11} className="relation-reference__ball-fill" />
      <path d="M -11 0 H 11 M 0 -11 V 11 M -7.8 -7.8 Q 0 0 -7.8 7.8 M 7.8 -7.8 Q 0 0 7.8 7.8" className="relation-reference__ball-seams" />
    </g>
  )
}

/** Aro reconocible (anillo + insinuación de red), no un círculo genérico. */
function HoopIcon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const netTop = 0.85
  const netBottom = r * 1.55
  return (
    <g>
      <path
        className="relation-reference__net"
        d={`M ${cx - r * 0.55} ${cy + r * netTop} L ${cx - r * 0.15} ${cy + netBottom} M ${cx} ${cy + r * 0.98} L ${cx} ${cy + netBottom} M ${cx + r * 0.55} ${cy + r * netTop} L ${cx + r * 0.15} ${cy + netBottom}`}
      />
      <circle cx={cx} cy={cy} r={r} className="relation-reference__hoop-ring" />
    </g>
  )
}

/**
 * Leyenda de los seis estados geométricos posibles: puramente informativa
 * (no son botones ni selectores) — el estado real, detectado a partir de
 * la posición del balón, se muestra aparte en `CurrentRelationBanner`. El
 * esquema (balón + aro reconocibles) es el protagonista; el nombre y la
 * condición quedan como información secundaria, sin repetir lo que ya
 * muestra el dibujo.
 */
export function RelationReference() {
  return (
    <div className="relation-reference">
      {ORDER.map((relation) => (
        <div className="relation-reference__card" key={relation}>
          <svg className="relation-reference__diagram" viewBox="0 0 100 76" role="img" aria-label={CIRCLE_RELATION_LABELS[relation]}>
            <HoopIcon cx={HOOP_X} cy={CY} r={HOOP_R} />
            <BallIcon cx={BALL_X[relation]} cy={CY} r={BALL_R} />
          </svg>
          <p className="relation-reference__name">{CIRCLE_RELATION_LABELS[relation]}</p>
          <p className="relation-reference__condition">{CIRCLE_RELATION_CONDITIONS[relation]}</p>
        </div>
      ))}
    </div>
  )
}
