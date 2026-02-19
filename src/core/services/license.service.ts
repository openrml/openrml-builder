// /src/core/services/license.service.ts
import { 
  LicenseType, 
  LicenseInfo, 
  LicenseTerms 
} from '../domain/role/types';

export class LicenseService {
  // Standard license definitions
  private readonly LICENSE_DEFINITIONS: Record<LicenseType, LicenseTerms> = {
    // Creative Commons licenses
    'CC-BY-4.0': {
      canUse: true,
      canModify: true,
      canDistribute: true,
      canUseCommercially: true,
      mustAttribute: true,
      mustShareAlike: false
    },
    
    'CC-BY-SA-4.0': {
      canUse: true,
      canModify: true,
      canDistribute: true,
      canUseCommercially: true,
      mustAttribute: true,
      mustShareAlike: true
    },
    
    'CC-BY-NC-4.0': {
      canUse: true,
      canModify: true,
      canDistribute: true,
      canUseCommercially: false,
      mustAttribute: true,
      mustShareAlike: false
    },
    
    'CC-BY-NC-SA-4.0': {
      canUse: true,
      canModify: true,
      canDistribute: true,
      canUseCommercially: false,
      mustAttribute: true,
      mustShareAlike: true
    },
    
    'CC-BY-ND-4.0': {  // Добавлено
      canUse: true,
      canModify: false,
      canDistribute: true,
      canUseCommercially: true,
      mustAttribute: true,
      mustShareAlike: false
    },
    
    'CC-BY-NC-ND-4.0': {  // Добавлено
      canUse: true,
      canModify: false,
      canDistribute: true,
      canUseCommercially: false,
      mustAttribute: true,
      mustShareAlike: false
    },
    
    // Custom license (most restrictive by default)
    'CUSTOM': {
      canUse: true,
      canModify: false,
      canDistribute: false,
      canUseCommercially: false,
      mustAttribute: true,
      mustShareAlike: false
    }
  };

  // License selection matrix for users
  private readonly SELECTION_MATRIX = [
    {
      goal: 'Maximum reach (virality)',
      description: 'I want my role to be used by as many people as possible',
      recommendation: 'CC-BY-4.0',
      why: 'Allows free use, modification, and commercial use with attribution'
    },
    {
      goal: 'Protect authorship',
      description: 'I want my name to always be mentioned with the role',
      recommendation: 'CC-BY-4.0',
      why: 'Requires attribution for any use'
    },
    {
      goal: 'Prevent others from profiting',
      description: 'I don\'t want others to make money from my role without my permission',
      recommendation: 'CC-BY-NC-4.0',
      why: 'Prohibits commercial use without permission'
    },
    {
      goal: 'Prevent modifications to your persona',
      description: 'I want my role to always remain unchanged',
      recommendation: 'CC-BY-ND-4.0',  // Исправлено с CC-BY-NC-ND-4.0 на CC-BY-ND-4.0
      why: 'Prohibits modification'
    },
    {
      goal: 'Prevent modifications and commercial use',
      description: 'I want my role to remain unchanged and non-commercial',
      recommendation: 'CC-BY-NC-ND-4.0',  // Добавлено
      why: 'Prohibits modification and commercial use'
    },
    {
      goal: 'Sell to corporations',
      description: 'I plan to sell usage licenses',
      recommendation: 'CUSTOM',
      why: 'Allows custom licensing terms'
    },
    {
      goal: 'Collaborative development',
      description: 'I want improvements to my role to be available to everyone',
      recommendation: 'CC-BY-SA-4.0',
      why: 'Requires derivative works to be shared under the same license'
    }
  ];

  // Get license terms by type
  getLicenseTerms(licenseType: LicenseType): LicenseTerms {
    return this.LICENSE_DEFINITIONS[licenseType] || this.LICENSE_DEFINITIONS['CUSTOM'];
  }

  // Create LicenseInfo object
  createLicenseInfo(
    licenseType: LicenseType, 
    attribution?: string,
    expiresAt?: string
  ): LicenseInfo {
    return {
      type: licenseType,
      terms: this.getLicenseTerms(licenseType),
      attribution: attribution || undefined,
      expiresAt: expiresAt || undefined
    };
  }

  // Get license recommendations for UI
  getLicenseRecommendations() {
    return this.SELECTION_MATRIX;
  }

  // Recommend license based on user goals
  recommendLicense(goals: string[]): LicenseType {
    const goalMap: Record<string, LicenseType> = {
      'virality': 'CC-BY-4.0',
      'maximum reach': 'CC-BY-4.0',
      'authorship': 'CC-BY-4.0',
      'attribution': 'CC-BY-4.0',
      'prevent profit': 'CC-BY-NC-4.0',
      'non-commercial': 'CC-BY-NC-4.0',
      'prevent modifications': 'CC-BY-ND-4.0',  // Исправлено
      'no derivatives': 'CC-BY-ND-4.0',  // Исправлено
      'prevent modifications and commercial': 'CC-BY-NC-ND-4.0',  // Добавлено
      'no derivatives non-commercial': 'CC-BY-NC-ND-4.0',  // Добавлено
      'sell': 'CUSTOM',
      'commercial': 'CUSTOM',
      'corporations': 'CUSTOM',
      'collaborative': 'CC-BY-SA-4.0',
      'share alike': 'CC-BY-SA-4.0'
    };

    for (const goal of goals) {
      const lowerGoal = goal.toLowerCase();
      for (const [key, license] of Object.entries(goalMap)) {
        if (lowerGoal.includes(key)) {
          return license;
        }
      }
    }

    // Default license
    return 'CC-BY-4.0';
  }

  // Check license compatibility (can role2 be used as derivative of role1)
  checkLicenseCompatibility(sourceLicense: LicenseType, derivativeLicense: LicenseType): {
    compatible: boolean;
    restrictions: string[];
  } {
    const sourceTerms = this.getLicenseTerms(sourceLicense);
    const derivativeTerms = this.getLicenseTerms(derivativeLicense);
    
    const restrictions: string[] = [];

    // ShareAlike check: if source requires SA, derivative must also require SA
    if (sourceTerms.mustShareAlike && !derivativeTerms.mustShareAlike) {
      restrictions.push('Derivative work must use the same license (ShareAlike)');
    }

    // NonCommercial check: if source is NC, derivative must also be NC
    if (!sourceTerms.canUseCommercially && derivativeTerms.canUseCommercially) {
      restrictions.push('Derivative work cannot be commercial if source is non-commercial');
    }

    // NoDerivatives check: derivative cannot have fewer restrictions on modification
    if (!sourceTerms.canModify && derivativeTerms.canModify) {
      restrictions.push('Cannot allow modifications if source license prohibits them');
    }

    return {
      compatible: restrictions.length === 0,
      restrictions
    };
  }

  // Generate license text for display
  generateLicenseText(licenseInfo: LicenseInfo): string {
    const terms = licenseInfo.terms;
    const parts: string[] = [];
    
    if (terms.canUse) parts.push('✓ Can be used');
    if (terms.canModify) parts.push('✓ Can be modified');
    if (terms.canDistribute) parts.push('✓ Can be distributed');
    
    if (terms.canUseCommercially) {
      parts.push('✓ Can be used for commercial purposes');
    } else {
      parts.push('✗ Cannot be used for commercial purposes');
    }
    
    if (terms.mustAttribute) parts.push('✓ Must attribute the author');
    if (terms.mustShareAlike) parts.push('✓ Derivative works must use the same license');
    
    if (licenseInfo.attribution) {
      parts.push(`Attribution: ${licenseInfo.attribution}`);
    }
    
    if (licenseInfo.expiresAt) {
      parts.push(`Valid until: ${licenseInfo.expiresAt}`);
    }
    
    return parts.join('\n');
  }

  // Check permission for specific action
  checkPermission(licenseInfo: LicenseInfo, action: 'use' | 'modify' | 'distribute' | 'commercial'): boolean {
    const terms = licenseInfo.terms;
    
    switch (action) {
      case 'use':
        return terms.canUse;
      case 'modify':
        return terms.canModify;
      case 'distribute':
        return terms.canDistribute;
      case 'commercial':
        return terms.canUseCommercially;
      default:
        return false;
    }
  }

  // Validate license expiry date
  validateLicenseExpiry(licenseInfo: LicenseInfo): { valid: boolean; expired: boolean; daysLeft?: number } {
    if (!licenseInfo.expiresAt) {
      return { valid: true, expired: false };
    }
    
    const expiryDate = new Date(licenseInfo.expiresAt);
    const now = new Date();
    
    if (expiryDate < now) {
      return { valid: false, expired: true };
    }
    
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return { 
      valid: daysLeft > 0, 
      expired: false, 
      daysLeft 
    };
  }

  // Get all available license types
  getAvailableLicenseTypes(): Array<{ type: LicenseType; name: string; description: string }> {
    return [
      {
        type: 'CC-BY-4.0',
        name: 'Creative Commons Attribution 4.0',
        description: 'Most permissive. Allows any use with attribution.'
      },
      {
        type: 'CC-BY-SA-4.0',
        name: 'Creative Commons Attribution-ShareAlike 4.0',
        description: 'Allows modifications but requires same license for derivatives.'
      },
      {
        type: 'CC-BY-NC-4.0',
        name: 'Creative Commons Attribution-NonCommercial 4.0',
        description: 'Non-commercial use only with attribution.'
      },
      {
        type: 'CC-BY-NC-SA-4.0',
        name: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0',
        description: 'Non-commercial, requires same license for derivatives.'
      },
      {
        type: 'CC-BY-ND-4.0',  // Добавлено
        name: 'Creative Commons Attribution-NoDerivatives 4.0',
        description: 'Allows use and distribution but no modifications.'
      },
      {
        type: 'CC-BY-NC-ND-4.0',  // Добавлено
        name: 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0',
        description: 'Most restrictive. Non-commercial use only, no modifications.'
      },
      {
        type: 'CUSTOM',
        name: 'Custom License',
        description: 'Define your own terms. Most restrictive by default.'
      }
    ];
  }
}