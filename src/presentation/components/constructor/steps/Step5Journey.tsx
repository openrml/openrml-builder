import React, { useState } from 'react';
import { Role, Session } from '../../../../core/domain/role/types';
import { useLanguage } from '../../../contexts/language.context';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Plus, X, GripVertical, Clock, Target } from 'lucide-react';

interface Step5JourneyProps {
  role: Role;
  onChange: (updates: Partial<Role>) => void;
}

export const Step5Journey: React.FC<Step5JourneyProps> = ({ role, onChange }) => {
  const { t } = useLanguage();
  
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [sessionTasks, setSessionTasks] = useState<{ [sessionId: string]: string }>({});
  const [sessionOutcomes, setSessionOutcomes] = useState<{ [sessionId: string]: string }>({});

  const addSession = () => {
    if (newSessionTitle.trim()) {
      const newSession: Session = {
        id: Date.now().toString(),
        title: newSessionTitle.trim(),
        tasks: [],
        outcomes: [], // 🆕 P0
        estimatedDuration: undefined // 🆕 P0
      };
      onChange({ sessions: [...role.sessions, newSession] });
      setNewSessionTitle('');
    }
  };

  const removeSession = (sessionId: string) => {
    onChange({ sessions: role.sessions.filter(s => s.id !== sessionId) });
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    onChange({
      sessions: role.sessions.map(s =>
        s.id === sessionId ? { ...s, title } : s
      ),
    });
  };

  // 🆕 P0: Обновление продолжительности
  const updateSessionDuration = (sessionId: string, duration: number | undefined) => {
    onChange({
      sessions: role.sessions.map(s =>
        s.id === sessionId ? { ...s, estimatedDuration: duration } : s
      ),
    });
  };

  const addTask = (sessionId: string) => {
    const taskText = sessionTasks[sessionId];
    if (taskText?.trim()) {
      onChange({
        sessions: role.sessions.map(s =>
          s.id === sessionId
            ? { ...s, tasks: [...s.tasks, taskText.trim()] }
            : s
        ),
      });
      setSessionTasks({ ...sessionTasks, [sessionId]: '' });
    }
  };

  const removeTask = (sessionId: string, taskIndex: number) => {
    onChange({
      sessions: role.sessions.map(s =>
        s.id === sessionId
          ? { ...s, tasks: s.tasks.filter((_, i) => i !== taskIndex) }
          : s
      ),
    });
  };

  const updateTask = (sessionId: string, taskIndex: number, text: string) => {
    const updatedTasks = [...role.sessions.find(s => s.id === sessionId)!.tasks];
    updatedTasks[taskIndex] = text;
    
    onChange({
      sessions: role.sessions.map(s =>
        s.id === sessionId ? { ...s, tasks: updatedTasks } : s
      ),
    });
  };

  // 🆕 P0: Добавление outcome
  const addOutcome = (sessionId: string) => {
    const outcomeText = sessionOutcomes[sessionId];
    if (outcomeText?.trim()) {
      onChange({
        sessions: role.sessions.map(s =>
          s.id === sessionId
            ? { ...s, outcomes: [...(s.outcomes || []), outcomeText.trim()] }
            : s
        ),
      });
      setSessionOutcomes({ ...sessionOutcomes, [sessionId]: '' });
    }
  };

  // 🆕 P0: Удаление outcome
  const removeOutcome = (sessionId: string, outcomeIndex: number) => {
    onChange({
      sessions: role.sessions.map(s =>
        s.id === sessionId
          ? { ...s, outcomes: (s.outcomes || []).filter((_, i) => i !== outcomeIndex) }
          : s
      ),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 🆕 P0: Journey Pacing (минимальная реализация) */}
      <div className="bg-[hsl(var(--color-info-light))] border border-[hsl(var(--color-info))]/30 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-[hsl(var(--color-info))]" />
          <Label className="text-sm sm:text-base font-semibold text-[hsl(var(--color-info))]">Journey Pacing</Label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Recommended Interval</Label>
            <Input
              value={role.journeyPacing?.recommendedInterval || ''}
              onChange={(e) => onChange({ 
                journeyPacing: { 
                  ...role.journeyPacing, 
                  recommendedInterval: e.target.value 
                } 
              })}
              placeholder="every 2–3 days"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Max Sessions/Week</Label>
            <Input
              type="number"
              value={role.journeyPacing?.maxSessionsPerWeek || ''}
              onChange={(e) => onChange({ 
                journeyPacing: { 
                  ...role.journeyPacing, 
                  maxSessionsPerWeek: e.target.value ? parseInt(e.target.value) : undefined 
                } 
              })}
              placeholder="2–3"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Label className="text-sm sm:text-base font-semibold">{t('journeyProgram')}</Label>
        <span className="text-xs sm:text-sm text-[hsl(var(--color-muted-foreground))]">
          {role.sessions.length} {t('session').toLowerCase()}(s)
        </span>
      </div>

      {/* Sessions List */}
      <div className="space-y-3 sm:space-y-4">
        {role.sessions.map((session, index) => (
          <Card key={session.id} className="border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))]/30 transition-colors">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--color-muted-foreground))]/70" />
                <CardTitle className="text-sm sm:text-base flex-1">
                  <Input
                    value={session.title}
                    onChange={(e) => updateSessionTitle(session.id, e.target.value)}
                    placeholder={`${t('session')} ${index + 1} title...`}
                    className="border-none text-sm sm:text-base font-semibold p-0 focus-visible:ring-0"
                  />
                </CardTitle>
                <button
                  onClick={() => removeSession(session.id)}
                  className="text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))]"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              
              {/* 🆕 P0: Продолжительность сессии */}
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-[hsl(var(--color-muted-foreground))]" />
                <Input
                  type="number"
                  value={session.estimatedDuration || ''}
                  onChange={(e) => updateSessionDuration(session.id, e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Duration (minutes)"
                  className="w-24 text-xs h-6"
                />
                <span className="text-xs text-[hsl(var(--color-muted-foreground))]">minutes</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Tasks */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Tasks</Label>
                {session.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center gap-2 group">
                    <span className="text-[hsl(var(--color-success))] font-bold text-xs sm:text-sm">✓</span>
                    <Input
                      value={task}
                      onChange={(e) => updateTask(session.id, taskIndex, e.target.value)}
                      placeholder="Task description..."
                      className="flex-1 border-none focus-visible:ring-0 p-0 text-xs sm:text-sm"
                    />
                    <button
                      onClick={() => removeTask(session.id, taskIndex)}
                      className="text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    value={sessionTasks[session.id] || ''}
                    onChange={(e) => setSessionTasks({ ...sessionTasks, [session.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addTask(session.id)}
                    placeholder="Add new task..."
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button onClick={() => addTask(session.id)} size="sm" variant="outline" className="gap-1 sm:gap-2">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* 🆕 P0: Expected Outcomes */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-[hsl(var(--color-primary))]" />
                  <Label className="text-xs font-medium text-[hsl(var(--color-primary))]">Expected Outcomes</Label>
                </div>
                
                {(session.outcomes || []).map((outcome, outcomeIndex) => (
                  <div key={outcomeIndex} className="flex items-center gap-2 group pl-3">
                    <span className="text-[hsl(var(--color-primary))] font-bold text-xs">•</span>
                    <Input
                      value={outcome}
                      onChange={(e) => {
                        const newOutcomes = [...(session.outcomes || [])];
                        newOutcomes[outcomeIndex] = e.target.value;
                        onChange({
                          sessions: role.sessions.map(s =>
                            s.id === session.id ? { ...s, outcomes: newOutcomes } : s
                          ),
                        });
                      }}
                      placeholder="Expected result..."
                      className="flex-1 border-none focus-visible:ring-0 p-0 text-xs"
                    />
                    <button
                      onClick={() => removeOutcome(session.id, outcomeIndex)}
                      className="text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                  <Input
                    value={sessionOutcomes[session.id] || ''}
                    onChange={(e) => setSessionOutcomes({ ...sessionOutcomes, [session.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addOutcome(session.id)}
                    placeholder="Add expected outcome..."
                    className="flex-1 text-xs"
                  />
                  <Button onClick={() => addOutcome(session.id)} size="sm" variant="outline" className="gap-1 h-6 text-xs">
                    <Plus className="w-2 h-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Session */}
      <div className="border-2 border-dashed border-[hsl(var(--color-border))] rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSession()}
            placeholder={t('sessionTitlePlaceholder') || "New session title..."}
            className="flex-1 text-sm sm:text-base"
          />
          <Button onClick={addSession} className="gap-1 sm:gap-2">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            {t('addSession')}
          </Button>
        </div>
        <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-2">
          {t('sessionTip') || "Sessions represent stages in the user's journey with your AI role"}
        </p>
      </div>
    </div>
  );
};