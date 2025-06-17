
import React from 'react';
import { Users, Code, Zap, Accessibility } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CategoryScores {
  ux: number;
  code: number;
  performance: number;
  accessibility: number;
}

interface IssueWithSuggestion {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  codeSuggestion?: any;
}

interface CategoryScoreGridProps {
  categoryScores: CategoryScores;
  issuesWithSuggestions: IssueWithSuggestion[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  competitorAnalysis: {[key: string]: CategoryScores};
}

const CategoryScoreGrid: React.FC<CategoryScoreGridProps> = ({
  categoryScores,
  issuesWithSuggestions,
  selectedCategory,
  onCategorySelect,
  competitorAnalysis
}) => {
  const categoryData = [
    {
      id: 'ux' as keyof CategoryScores,
      label: 'User Experience',
      shortLabel: 'UX',
      score: categoryScores.ux,
      icon: Users,
      color: 'blue',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'ux')
    },
    {
      id: 'code' as keyof CategoryScores,
      label: 'Code Quality',
      shortLabel: 'Code',
      score: categoryScores.code,
      icon: Code,
      color: 'green',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'code')
    },
    {
      id: 'performance' as keyof CategoryScores,
      label: 'Performance',
      shortLabel: 'Perf',
      score: categoryScores.performance,
      icon: Zap,
      color: 'yellow',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'performance')
    },
    {
      id: 'accessibility' as keyof CategoryScores,
      label: 'Accessibility',
      shortLabel: 'A11y',
      score: categoryScores.accessibility,
      icon: Accessibility,
      color: 'purple',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'accessibility')
    }
  ];

  const getColorClasses = (color: string, score: number) => {
    const baseColors = {
      purple: score >= 80 ? 'bg-purple-100 text-purple-800' : score >= 60 ? 'bg-purple-50 text-purple-600' : 'bg-purple-25 text-purple-500',
      yellow: score >= 80 ? 'bg-yellow-100 text-yellow-800' : score >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-yellow-25 text-yellow-500',
      blue: score >= 80 ? 'bg-blue-100 text-blue-800' : score >= 60 ? 'bg-blue-50 text-blue-600' : 'bg-blue-25 text-blue-500',
      green: score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-green-50 text-green-600' : 'bg-green-25 text-green-500'
    };
    return baseColors[color as keyof typeof baseColors];
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {categoryData.map((category) => {
          const IconComponent = category.icon;
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-dashed ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : 'border-gray-300'
              } ${getColorClasses(category.color, category.score)} transform hover:-rotate-1`}
              onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
              style={{ 
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                fontFamily: '"Comic Sans MS", cursive'
              }}
            >
              <CardContent className="p-3 md:p-4">
                <div className="text-center mb-2 md:mb-3">
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2" />
                  <h4 className="font-semibold text-xs md:text-sm">
                    <span className="md:hidden">{category.shortLabel}</span>
                    <span className="hidden md:inline">{category.label}</span>
                  </h4>
                  <p className="text-xl md:text-2xl font-bold mt-1">{category.score}%</p>
                  <div className="text-xs mt-1 md:mt-2 opacity-75">
                    {category.issues.length} issues
                  </div>
                </div>

                {Object.keys(competitorAnalysis).length > 0 && (
                  <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-current/20">
                    <div className="text-xs font-medium mb-1 md:mb-2">vs Competitors:</div>
                    <div className="space-y-1">
                      {Object.entries(competitorAnalysis).slice(0, 2).map(([competitorName, analysis]) => {
                        const competitorScore = analysis[category.id];
                        const isAhead = category.score > competitorScore;
                        
                        return (
                          <div key={competitorName} className="flex items-center justify-between text-xs">
                            <span className="truncate max-w-[60px] md:max-w-none">
                              {competitorName.length > 8 ? `${competitorName.slice(0, 8)}...` : competitorName}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className={`font-medium text-xs ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
                                {competitorScore}%
                              </span>
                              <span className={isAhead ? 'text-green-600' : 'text-red-600'}>
                                {isAhead ? '↓' : '↑'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
          <p className="text-sm text-blue-700" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
            <span className="block md:inline">Showing results for: </span>
            <strong className="block md:inline">{categoryData.find(cat => cat.id === selectedCategory)?.label}</strong>
            <Button variant="ghost" size="sm" onClick={() => onCategorySelect(null)} className="ml-0 md:ml-2 mt-2 md:mt-0 text-xs">
              Show All
            </Button>
          </p>
        </div>
      )}
    </>
  );
};

export default CategoryScoreGrid;
