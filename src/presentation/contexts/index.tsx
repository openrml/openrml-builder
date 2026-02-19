import React from 'react';
import { LanguageProvider } from './language.context';
import { NavigationProvider } from './navigation.context';
import { StorageProvider } from './storage.context';
import { RoleEditorProvider } from './role-editor.context';
import { createEmptyRole } from '../../core/services/role-factory';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initialRole = createEmptyRole();
  
  return (
    <LanguageProvider defaultLanguage="en">
      <StorageProvider>
        <NavigationProvider defaultView="dashboard">
          <RoleEditorProvider initialRole={initialRole}>
            {children}
          </RoleEditorProvider>
        </NavigationProvider>
      </StorageProvider>
    </LanguageProvider>
  );
}