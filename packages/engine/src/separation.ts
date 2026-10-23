import {
  parse,
  filterDeficiencyProt,
  filterDeficiencyDeuter,
  filterDeficiencyTrit,
  clampRgb,
  differenceEuclidean,
  converter,
  Color,
} from 'culori';

export type Vision = 'protan' | 'deutan' | 'tritan';

const filters: Record<Vision, ReturnType<typeof filterDeficiencyProt>> = {
  protan: filterDeficiencyProt(1),
  deutan: filterDeficiencyDeuter(1),
  tritan: filterDeficiencyTrit(1),
};

type Row = [number, number, number];
type Matrix = [Row, Row, Row];

// Machado, Oliveira & Fernandes (2009), "A Physiologically-based Model for
// Simulation of Color Vision Deficiency", IEEE TVCG, doi:10.1109/TVCG.2009.113.
// Severity 1.0 rows of Table 1:
// https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
// Applied in linear RGB (paper p. 1294; see also R colorspace::simulate_cvd).
const MACHADO: Record<Vision, Matrix> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

const toLinear = converter('lrgb');
const oklabDistance = differenceEuclidean('oklab');
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function simulate(color: Color, vision: Vision): Color {
  const { r, g, b } = toLinear(color);
  const [m0, m1, m2] = MACHADO[vision];
  return {
    mode: 'lrgb',
    r: clamp01(m0[0] * r + m0[1] * g + m0[2] * b),
    g: clamp01(m1[0] * r + m1[1] * g + m1[2] * b),
    b: clamp01(m2[0] * r + m2[1] * g + m2[2] * b),
  };
}

export function separation(a: string, b: string, vision: Vision): number {
  // Parse both colours, and throw a clear error if either is invalid
  const colorA = parse(a);
  const colorB = parse(b);
  if (!colorA) throw new Error(`Invalid colour: "${a}"`);
  if (!colorB) throw new Error(`Invalid colour: "${b}"`);

  // Simulate each one with the filter for this vision type, at severity 1
  // Clamp each simulated colour with clampRgb
  // Return the OKLab distance between them, times 100
  return (
    oklabDistance(simulate(colorA, vision), simulate(colorB, vision)) * 100
  );
}
