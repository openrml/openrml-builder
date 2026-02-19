import React, { createContext, useContext, useState } from 'react';
import { Role } from '../../core/domain/role/types';

type View = 'dashboard' | 'constructor';

interface NavigationContextType {
  view: View;
  setView: (view: View) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  currentRole: Role | null;
  setCurrentRole: (role: Role) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ 
  children, 
  defaultView = 'dashboard' 
}: { 
  children: React.ReactNode; 
  defaultView?: View;
}) {
  const [view, setView] = useState<View>(defaultView);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  return (
    <NavigationContext.Provider
      value={{
        view,
        setView,
        currentStep,
        setCurrentStep,
        currentRole,
        setCurrentRole,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}