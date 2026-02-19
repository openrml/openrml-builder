import { rmlIdentityService } from './identity.service';
import { createTestRole } from '../../../test/factories/role.factory';

describe('RMLIdentityService', () => {
  it('should generate deterministic identity for same role', () => {
    const role = createTestRole();
    const id1 = rmlIdentityService.generateIdentity(role);
    const id2 = rmlIdentityService.generateIdentity(role);
    
    expect(id1?.rmlIdentity.fullId).toBe(id2?.rmlIdentity.fullId);
  });
  
  it('should detect changes in components', () => {
    const role = createTestRole();
    const original = rmlIdentityService.generateIdentity(role);
    
    const modified = { ...role, mainGoal: 'Different goal' };
    const validation = rmlIdentityService.validateIdentity({
      ...modified,
      rmlIdentity: original?.rmlIdentity
    });
    
    expect(validation.valid).toBe(false);
    expect(validation.mismatchedComponents).toContain('base');
  });
});