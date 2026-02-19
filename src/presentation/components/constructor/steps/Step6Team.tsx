import React, { useState } from 'react';
import { Role, SubRole } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus, X, Database } from 'lucide-react';

interface Step6TeamProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step6Team: React.FC<Step6TeamProps> = ({ role, onChange }) => {
  const { t } = useLanguage();
  const [newSubRoleName, setNewSubRoleName] = useState('');
  const [newSubRoleDesc, setNewSubRoleDesc] = useState('');

  const addSubRole = () => {
    if (newSubRoleName.trim()) {
      const newSubRole: SubRole = {
        id: `subrole-${Date.now()}`,
        name: newSubRoleName.trim(),
        description: newSubRoleDesc.trim(),
      };
      onChange({
        subRoles: [...role.subRoles, newSubRole],
        teamEnabled: true,
      });
      setNewSubRoleName('');
      setNewSubRoleDesc('');
    }
  };

  const removeSubRole = (id: string) => {
    onChange({
      subRoles: role.subRoles.filter(sr => sr.id !== id),
    });
  };

  const updateSubRole = (id: string, updates: Partial<SubRole>) => {
    onChange({
      subRoles: role.subRoles.map(sr =>
        sr.id === id ? { ...sr, ...updates } : sr
      ),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Team Mode Toggle */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-[hsl(var(--color-muted))] rounded-lg border border-[hsl(var(--color-border))]">
        <div className="flex-1">
          <Label className="text-sm sm:text-base font-semibold">{t('teamMode')}</Label>
          <p className="text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))] mt-1">{t('enableTeam')}</p>
        </div>
        <Switch
          checked={role.teamEnabled}
          onCheckedChange={(checked) => onChange({ teamEnabled: checked })}
        />
      </div>

      {role.teamEnabled && (
        <div className="space-y-4 sm:space-y-6">
          {/* Orchestrator */}
          <div className="space-y-2">
            <Label htmlFor="orchestrator" className="text-sm sm:text-base font-semibold">
              {t('orchestrator')}
            </Label>
            <Textarea
              id="orchestrator"
              value={role.orchestrator}
              onChange={(e) => onChange({ orchestrator: e.target.value })}
              placeholder="Coordinates team work, distributes tasks among specialists, consolidates results"
              rows={3}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          {/* Sub-roles */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm sm:text-base font-semibold">{t('subRoles')}</Label>
              <span className="text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))]">
                {role.subRoles.length} {t('roles')}
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {role.subRoles.map((subRole) => (
                <div
                  key={subRole.id}
                  className="flex items-start gap-2 sm:gap-3 bg-[hsl(var(--color-muted))] border border-[hsl(var(--color-border))] rounded-lg p-3 sm:p-4"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      value={subRole.name}
                      onChange={(e) =>
                        updateSubRole(subRole.id, { name: e.target.value })
                      }
                      placeholder="Sub-role name"
                      className="text-sm sm:text-base font-medium"
                    />
                    <Input
                      value={subRole.description}
                      onChange={(e) =>
                        updateSubRole(subRole.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubRole(subRole.id)}
                    className="text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] hover:bg-[hsl(var(--color-destructive))]/5"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Sub-role */}
            <div className="border-2 border-dashed border-[hsl(var(--color-border))] rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-medium">
                  {t('addSubRole')}
                </Label>
                <Input
                  value={newSubRoleName}
                  onChange={(e) => setNewSubRoleName(e.target.value)}
                  placeholder="Sub-role name (e.g., HR Specialist)"
                  onKeyPress={(e) => e.key === 'Enter' && addSubRole()}
                  className="text-sm sm:text-base"
                />
                <Input
                  value={newSubRoleDesc}
                  onChange={(e) => setNewSubRoleDesc(e.target.value)}
                  placeholder="Description (e.g., Resume evaluation)"
                  onKeyPress={(e) => e.key === 'Enter' && addSubRole()}
                  className="text-sm sm:text-base"
                />
              </div>
              <Button
                onClick={addSubRole}
                size="sm"
                className="w-full gap-1 sm:gap-2"
                disabled={!newSubRoleName.trim()}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                {t('addSubRole')}
              </Button>
            </div>
          </div>

          {/* Task Protocol */}
          <div className="space-y-2">
            <Label htmlFor="taskProtocol" className="text-sm sm:text-base font-semibold">
              {t('taskProtocol')}
            </Label>
            <Textarea
              id="taskProtocol"
              value={role.taskProtocol}
              onChange={(e) => onChange({ taskProtocol: e.target.value })}
              placeholder="1. Tasks are transferred upon reaching clear criteria
2. Each sub-role reports results weekly
3. Use standard templates for handoffs
4. Maintain communication log"
              rows={4}
              className="text-sm sm:text-base resize-none font-mono"
            />
          </div>

          {/* 🆕 P0: Memory Transfer */}
          <div className="space-y-2 border-2 border-[hsl(var(--color-info))]/30 rounded-lg p-3 sm:p-4 bg-[hsl(var(--color-info-light))]">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[hsl(var(--color-info))]" />
              <Label className="text-sm sm:text-base font-semibold text-[hsl(var(--color-info))]">Memory Transfer</Label>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-[hsl(var(--color-info))]">Enable Memory Sharing</p>
                <p className="text-xs text-[hsl(var(--color-info))]/70">Allow sub-roles to access shared memory</p>
              </div>
              <Switch
                checked={role.memoryTransfer?.enabled || false}
                onCheckedChange={(checked) => onChange({
                  memoryTransfer: {
                    scope: role.memoryTransfer?.scope ?? 'hot',
                    enabled: checked,
                  }
                })}
              />
            </div>

            {role.memoryTransfer?.enabled && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Memory Scope</Label>
                <Select
                  value={role.memoryTransfer?.scope || 'hot'}
                  onValueChange={(value) => onChange({
                    memoryTransfer: {
                      enabled: role.memoryTransfer?.enabled ?? false,
                      scope: value as 'hot' | 'warm' | 'full',
                    }
                  })}
                >
                  <SelectTrigger className="text-sm h-9">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot Memory Only (Recent 48h)</SelectItem>
                    <SelectItem value="warm">Warm Memory (1-2 weeks)</SelectItem>
                    <SelectItem value="full">Full Memory Access</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[hsl(var(--color-info))]/70">
                  Controls how much memory is shared between team members
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!role.teamEnabled && (
        <div className="text-center py-6 sm:py-8 text-[hsl(var(--color-muted-foreground))]">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">👥</div>
          <p className="text-xs sm:text-sm">{t('teamModeDisabled')}</p>
        </div>
      )}
    </div>
  );
};