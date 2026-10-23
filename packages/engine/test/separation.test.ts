import { describe, expect, it } from 'vitest';
import { separation } from '../src/separation';

describe('separation', () => {
  // Expected values below come from colorspacious 1.1.2 (Python), a separate
  // implementation of the same Machado (2009) model, not from this engine.
  // colorspacious simulated both colours with
  //   cspace_convert(colour, {'name': 'sRGB1+CVD', 'cvd_type': ..., 'severity': 100}, 'sRGB1')
  // and culori then measured the OKLab distance between them, times 100.

  // cvd_type 'protanomaly'
  it('finds Plotly colours 2 and 3 merge under protanopia', () => {
    expect(separation('#ff7f0e', '#2ca02c', 'protan')).toBeCloseTo(0.65, 2);
  });

  // cvd_type 'deuteranomaly'
  it('finds Plotly colours 2 and 3 clear under deuteranopia', () => {
    expect(separation('#ff7f0e', '#2ca02c', 'deutan')).toBeCloseTo(13.48, 2);
  });

  // cvd_type 'tritanomaly'
  it('finds Plotly colours 2 and 3 clear under tritanopia', () => {
    expect(separation('#ff7f0e', '#2ca02c', 'tritan')).toBeCloseTo(31.07, 2);
  });
});
