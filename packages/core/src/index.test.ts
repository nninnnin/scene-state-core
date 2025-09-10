import { describe, it, expect } from 'vitest';
import { version } from './index';

describe('core', () => {
  it('should return version string', () => {
    expect(version()).toContain('core-');
  });
});
