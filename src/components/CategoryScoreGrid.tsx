
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
      score: categoryScores.ux,
      icon: Users,
      color: 'blue',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'ux')
    },
    {
      id: 'code' as keyof CategoryScores,
      label: 'Code Quality',
      score: categoryScores.code,
      icon: Code,
      color: 'green',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'code')
    },
    {
      id: 'performance' as keyof CategoryScores,
      label: 'Performance',
      score: categoryScores.performance,
      icon: Zap,
      color: 'yellow',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'performance')
    },
    {
      id: 'accessibility' as keyof CategoryScores,
      label: 'Accessibility',
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
      <div className="grid md:grid-cols-4 gap-4">
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
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
                fontFamily: '"Comic Sans MS", cursive'
              }}
            >
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <IconComponent className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">{category.label}</h4>
                  <p className="text-2xl font-bold mt-1">{category.score}%</p>
                  <div className="text-xs mt-2 opacity-75">
                    {category.issues.length} issues found
                  </div>
                </div>

                {Object.keys(competitorAnalysis).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-current/20">
                    <div className="text-xs font-medium mb-2">vs Competitors:</div>
                    <div className="space-y-1">
                      {Object.entries(competitorAnalysis).map(([competitorName, analysis]) => {
                        const competitorScore = analysis[category.id];
                        const isAhead = category.score > competitorScore;
                        
                        return (
                          <div key={competitorName} className="flex items-center justify-between text-xs">
                            <span className="truncate">{competitorName}:</span>
                            <div className="flex items-center space-x-1">
                              <span className={`font-medium ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
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
        <div className="text-center p-2 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
          <p className="text-sm text-blue-700" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
            Showing results for: <strong>{categoryData.find(cat => cat.id === selectedCategory)?.label}</strong>
            <Button variant="ghost" size="sm" onClick={() => onCategorySelect(null)} className="ml-2">
              Show All
            </Button>
          </p>
        </div>
      )}
    </>
  );
};

export default CategoryScoreGrid;
