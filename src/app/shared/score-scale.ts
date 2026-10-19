/**
 * Niveaux de score et leurs seuils, recopiés de l'API (src/Enum/ScoreLevel.php).
 * À garder synchronisés : si les seuils changent côté Symfony, les changer ici.
 */
export type Level = 'ideal' | 'good' | 'occasional' | 'limit' | 'discouraged';

export interface ScaleSegment {
  level: Level;
  from: number;
  to: number;
  label: string;
}

const FOOD: ScaleSegment[] = [
  { level: 'discouraged', from: 0, to: 39, label: 'À éviter' },
  { level: 'limit', from: 40, to: 64, label: 'À limiter' },
  { level: 'occasional', from: 65, to: 84, label: 'Occasionnel' },
  { level: 'good', from: 85, to: 96, label: 'Bon choix' },
  { level: 'ideal', from: 97, to: 100, label: 'Idéal' },
];

// Laits infantiles : tous conformes à la réglementation, le score ne départage
// que des critères facultatifs. Pas de tranche « à éviter ».
const INFANT_FORMULA: ScaleSegment[] = [
  { level: 'limit', from: 0, to: 63, label: 'Conforme' },
  { level: 'occasional', from: 64, to: 69, label: 'Bon' },
  { level: 'good', from: 70, to: 77, label: 'Très bon' },
  { level: 'ideal', from: 78, to: 100, label: 'Excellent' },
];

export function scaleFor(isInfantFormula: boolean): ScaleSegment[] {
  return isInfantFormula ? INFANT_FORMULA : FOOD;
}

/** Libellé court pour une pastille (historique, accueil). */
export function shortLabel(level: string): string {
  return FOOD.find((s) => s.level === level)?.label ?? '';
}
