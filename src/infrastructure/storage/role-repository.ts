import { Role } from '../../core/domain/role/types';

const STORAGE_KEY = 'openrml-roles-v2';

export class RoleRepository {
  async getAll(): Promise<Role[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading roles from storage:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Role | null> {
    const roles = await this.getAll();
    return roles.find(role => role.id === id) || null;
  }

  async save(role: Role): Promise<void> {
    try {
      const roles = await this.getAll();
      const index = roles.findIndex(r => r.id === role.id);
      
      if (index >= 0) {
        roles[index] = role;
      } else {
        roles.push(role);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
    } catch (error) {
      console.error('Error saving role:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const roles = await this.getAll();
      const filtered = roles.filter(role => role.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  async searchByName(query: string): Promise<Role[]> {
    const roles = await this.getAll();
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return roles;
    
    return roles.filter(role => 
      role.name.toLowerCase().includes(normalizedQuery) ||
      role.description.toLowerCase().includes(normalizedQuery) ||
      role.archetype.toLowerCase().includes(normalizedQuery)
    );
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}