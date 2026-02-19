import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/language.context';
import { useStorage } from '../../contexts/storage.context';
import { useNavigation } from '../../contexts/navigation.context';
import { useRoleEditor } from '../../contexts/role-editor.context';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { LoadTemplateUseCase } from '../../../application/use-cases/load-template.use-case';
import { ExportRMLUseCase } from '../../../application/use-cases/export-rml.use-case';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Sparkles, Pencil, FileDown, Trash2, Plus, Star, Grid3x3, Users } from 'lucide-react';
import { toast } from 'sonner';
import { categories } from '../../../data/categories';

export const Dashboard: React.FC = () => {
  const { t, language } = useLanguage(); // Добавили language из контекста
  const { 
    roles, 
    isLoading, 
    saveRole, 
    deleteRole,
    previews,
    isLoadingTemplates,
    loadTemplates,
    searchTemplates,
    getTemplatesByCategory,
    getPopularTemplates
  } = useStorage();
  
  const { setView } = useNavigation();
  const { updateRole, setCurrentStep } = useRoleEditor();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'popular' | string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);

  // Загружаем шаблоны при монтировании
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Фильтрация шаблонов
  useEffect(() => {
    const filterTemplates = async () => {
      let result: any[] = [];
      
      if (selectedCategory === 'popular') {
        result = await getPopularTemplates();
      } else if (selectedCategory === 'all') {
        result = previews;
      } else {
        result = await getTemplatesByCategory(selectedCategory);
      }
      
      if (searchQuery.trim()) {
        const searched = await searchTemplates(searchQuery);
        const searchedIds = new Set(searched.map(t => t.id));
        result = result.filter(t => searchedIds.has(t.id));
      }
      
      setFilteredTemplates(result);
    };
    
    filterTemplates();
  }, [selectedCategory, searchQuery, previews, getPopularTemplates, getTemplatesByCategory, searchTemplates]);

  const handleCreateNew = async () => {
    const useCase = new CreateRoleUseCase();
    const result = await useCase.execute({});
    updateRole(result.role);
    setCurrentStep(1);
    setView('constructor');
    toast.success(t('roleCreated') || 'Role created successfully');
  };

  const handleUseTemplate = async (templateId: string) => {
    const useCase = new LoadTemplateUseCase();
    const result = await useCase.execute({ templateId });
    
    if (result.success && result.template) {
      updateRole(result.template);
      setCurrentStep(1);
      setView('constructor');
      toast.success(`${t('templateLoaded') || 'Template loaded'}: ${result.template.name}`);
    } else {
      toast.error(result.error || t('templateLoadError') || 'Failed to load template');
    }
  };

  const handleEditRole = async (role: any) => {
    updateRole(role);
    setCurrentStep(1);
    setView('constructor');
  };

  const handleExportRole = (role: any) => {
    const useCase = new ExportRMLUseCase();
    useCase.execute({ role, download: true });
    toast.success(`${t('roleExported') || 'Role exported'}: ${role.name}`);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm(t('deleteConfirmation') || 'Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
        toast.success(t('roleDeleted') || 'Role deleted successfully');
      } catch (error) {
        toast.error(t('deleteError') || 'Failed to delete role');
      }
    }
  };

  const handleDuplicateRole = async (role: any) => {
    const duplicated = { ...role, id: `copy-${Date.now()}`, name: `${role.name} (Copy)` };
    await saveRole(duplicated);
    toast.success(`${t('roleDuplicated') || 'Role duplicated'}: ${role.name}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Получаем уникальные категории из previews
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    previews.forEach(template => {
      if (template.category) {
        cats.add(template.category);
      }
    });
    return Array.from(cats);
  }, [previews]);

  // Используем текущий язык для отображения
  const currentLanguage = language || 'en';

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--color-primary))]/5 via-[hsl(var(--color-primary))]/5 to-[hsl(var(--color-secondary))]/5 p-6 mb-8 border border-[hsl(var(--color-border))]/50 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--color-foreground))] mb-3">
          {t('dashboardTitle') || 'Build Your AI Assistant'}
        </h1>
        <p className="text-[hsl(var(--color-muted-foreground))] mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          {t('dashboardSubtitle') || 'Create personalized AI roles with our intuitive 8-step builder. Start from scratch or use pre-built templates.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-active))] hover:from-[hsl(var(--color-primary-hover))] hover:to-[hsl(var(--color-primary-active))] text-[hsl(var(--color-primary-foreground))] px-6 py-6 text-base shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('startFromScratch') || 'Start from Scratch'}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setSelectedCategory('all')}
            className="px-6 py-6 text-base border-2 hover:border-[hsl(var(--color-primary))]/30"
          >
            <Grid3x3 className="w-5 h-5 mr-2" />
            {t('browseTemplates') || 'Browse Templates'}
          </Button>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--color-muted-foreground))]">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--color-primary))]"></div>
            <span>{t('stepBuilder') || '8-step guided builder'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--color-muted-foreground))]">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--color-secondary))]"></div>
            <span>{previews.length}+ {t('templatesCount') || 'templates'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--color-muted-foreground))]">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--color-success))]"></div>
            <span>{t('exportFeature') || 'Export to OpenRML format'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Templates Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[hsl(var(--color-foreground))]">
                {t('templateLibrary') || 'Template Library'}
              </h2>
              <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-1">
                {t('templateLibrarySubtitle') || 'Jumpstart your AI assistant with pre-built templates'}
              </p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--color-muted-foreground))]/70" />
              <Input
                type="text"
                placeholder={t('searchTemplates') || 'Search templates...'}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs - ИСПРАВЛЕНО: используем текущий язык */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('popular')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === 'popular'
                    ? 'bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary-active))] border border-[hsl(var(--color-primary))]/20'
                    : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {t('popular') || 'Popular'}
              </button>
              
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))] border border-[hsl(var(--color-border))]'
                    : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))]'
                }`}
              >
                {t('allTemplates') || 'All Templates'} ({previews.length})
              </button>
              
              {/* Категории из данных - ИСПРАВЛЕНО: используем текущий язык */}
              {uniqueCategories.slice(0, 6).map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                const categoryName = category?.name?.[currentLanguage] || 
                                    category?.name?.['en'] || 
                                    categoryId;
                
                return (
                  <button
                    key={categoryId}
                    onClick={() => setSelectedCategory(categoryId)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                      selectedCategory === categoryId
                        ? 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))] border border-[hsl(var(--color-border))]'
                        : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-accent))]'
                    }`}
                  >
                    {category?.icon} {categoryName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          {isLoadingTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-8 bg-[hsl(var(--color-accent))] rounded mb-2"></div>
                    <div className="h-4 bg-[hsl(var(--color-accent))] rounded"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 rounded-lg border border-dashed border-[hsl(var(--color-border))]">
              <div className="text-4xl text-[hsl(var(--color-muted-foreground))]/30 mb-4">🔍</div>
              <p className="text-base text-[hsl(var(--color-muted-foreground))] mb-4">
                {t('noTemplatesFound') || 'No templates found'}
              </p>
              <Button
                variant="outline"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="text-sm"
              >
                {t('showAllTemplates') || 'Show all templates'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  className="hover:shadow-lg transition-all duration-200 hover:border-[hsl(var(--color-primary))]/30 cursor-pointer group relative overflow-hidden card-hover"
                >
                  {template.isPopular && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-gradient-to-r from-[hsl(var(--color-secondary))] to-[hsl(var(--color-secondary-active))] text-white border-0 gap-1 shadow-sm text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {t('popular') || 'Popular'}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-3 pt-6">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {template.icon}
                    </div>
                    <CardTitle className="text-base font-semibold text-[hsl(var(--color-foreground))]">
                      {template.name?.[currentLanguage] || template.name?.['en'] || template.name || template.id}
                    </CardTitle>
                    <CardDescription className="text-sm text-[hsl(var(--color-muted-foreground))] line-clamp-2 mt-2">
                      {template.description?.[currentLanguage] || template.description?.['en'] || template.description || t('noDescription') || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-4">
                    <div className="flex flex-wrap gap-1 mb-3 justify-center">
                      {template.tags?.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                      className="w-full text-sm group-hover:bg-[hsl(var(--color-primary))]/5 group-hover:border-[hsl(var(--color-primary))]/30 group-hover:text-[hsl(var(--color-primary-active))] transition-colors"
                    >
                      {t('useTemplate') || 'Use Template'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* My Roles Section */}
        {roles.length > 0 && (
          <section className="border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[hsl(var(--color-foreground))] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('myRoles') || 'My AI Roles'}
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-1">
                  {t('myRolesSubtitle') || 'Your created and imported AI assistant roles'}
                </p>
              </div>
              <span className="text-sm text-[hsl(var(--color-muted-foreground))] px-3 py-1 bg-[hsl(var(--color-muted))] rounded-full">
                {roles.length} {t('rolesCount') || 'roles'}
              </span>
            </div>

            <div className="grid gap-4">
              {roles
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map(role => (
                  <Card key={role.id} className="hover:shadow-md transition-shadow border-[hsl(var(--color-border))]">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[hsl(var(--color-foreground))] truncate text-base">
                              {role.name || t('untitledRole') || 'Untitled Role'}
                            </h3>
                            <Badge variant="outline" className="text-xs w-fit capitalize">
                              {role.archetype}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-[hsl(var(--color-muted-foreground))] line-clamp-2 mb-3">
                            {role.description || t('noDescription') || 'No description'}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-[hsl(var(--color-muted-foreground))]/70">
                            <span>
                              {t('updated') || 'Updated'}: {new Date(role.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {t('created') || 'Created'}: {new Date(role.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 sm:ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            className="h-8 w-8 p-0"
                            title={t('edit') || 'Edit'}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateRole(role)}
                            className="h-8 w-8 p-0"
                            title={t('duplicate') || 'Duplicate'}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExportRole(role)}
                            className="h-8 w-8 p-0"
                            title={t('export') || 'Export'}
                          >
                            <FileDown className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                            className="h-8 w-8 p-0 text-[hsl(var(--color-destructive))] hover:text-[hsl(var(--color-destructive-hover))] hover:bg-[hsl(var(--color-destructive))]/5"
                            title={t('delete') || 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Empty State for Roles */}
        {roles.length === 0 && !isLoading && (
          <div className="text-center py-12 border-t">
            <div className="text-4xl text-[hsl(var(--color-muted-foreground))]/30 mb-4">📁</div>
            <p className="text-base text-[hsl(var(--color-muted-foreground))] mb-4">
              {t('noRolesCreated') || 'No AI roles created yet'}
            </p>
            <Button onClick={handleCreateNew} variant="outline" className="text-sm">
              {t('createFirstRole') || 'Create your first AI role'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};