import { describe, expect, it } from 'vitest';
import { separation } from '../src/separation';

describe('separation', () => {
  it('finds Plotly colours 2 and 3 merge under protanopia', () => {
    expect(separation('#ff7f0e', '#2ca02c', 'protan')).toBeCloseTo(0.65, 2);
  });
});