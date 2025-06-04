
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Figma, FileImage, FileText, Code, BarChart3, Share2, Eye, Zap, Shield, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import AnnotationCanvas from '@/components/AnnotationCanvas';
import CodeSuggestions from '@/components/CodeSuggestions';

const Index = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process with comprehensive sample data
    setTimeout(() => {
      setAnalysisResults({
        score: 73,
        comparison: {
          competitors: [
            { name: 'Amazon AWS', score: 68, category: 'performance' },
            { name: 'Google Cloud', score: 71, category: 'accessibility' },
            { name: 'Microsoft Azure', score: 69, category: 'ux' }
          ],
          betterThan: 65,
          position: '23rd percentile'
        },
        issues: [
          { 
            type: 'accessibility', 
            severity: 'high', 
            description: 'Color contrast ratio of 3.2:1 in navigation links falls below WCAG AA standard (4.5:1 required)' 
          },
          { 
            type: 'accessibility', 
            severity: 'medium', 
            description: 'Missing alt attributes on 3 decorative images in the hero section' 
          },
          { 
            type: 'performance', 
            severity: 'high', 
            description: 'Large hero image (2.4MB) causing 3.2s delay in First Contentful Paint' 
          },
          { 
            type: 'performance', 
            severity: 'medium', 
            description: 'Unused CSS rules detected - 45% of stylesheet not utilized' 
          },
          { 
            type: 'ux', 
            severity: 'medium', 
            description: 'Call-to-action buttons lack sufficient spacing (current: 8px, recommended: 16px minimum)' 
          },
          { 
            type: 'ux', 
            severity: 'low', 
            description: 'Mobile navigation menu opens without animation, creating jarring user experience' 
          },
          { 
            type: 'code', 
            severity: 'medium', 
            description: 'Inline styles detected in 12 components - consider moving to CSS classes for maintainability' 
          },
          { 
            type: 'code', 
            severity: 'low', 
            description: 'Console warnings about deprecated React lifecycle methods in ContactForm component' 
          }
        ],
        suggestions: [
          'Update navigation link colors to #2563eb (blue-600) to achieve 4.7:1 contrast ratio',
          'Add descriptive alt text to hero images or mark as decorative with alt=""',
          'Implement WebP format and lazy loading for images to reduce load time by 60%',
          'Remove unused CSS classes and consider CSS purging in build process',
          'Increase button margins to 16px and add hover states for better accessibility',
          'Add smooth slide-down animation to mobile menu using CSS transitions',
          'Create a centralized theme system using CSS custom properties',
          'Update ContactForm to use React hooks instead of class components',
          'Implement semantic HTML5 landmarks (header, nav, main, footer) for screen readers',
          'Add focus indicators for keyboard navigation users',
          'Consider implementing a design system with consistent spacing tokens',
          'Add loading states for form submissions to improve perceived performance'
        ],
        codeSuggestions: [
          {
            file: 'src/components/Header.tsx',
            issue: 'Missing semantic HTML structure and accessibility attributes',
            type: 'accessibility',
            before: `<div className="header">
  <div className="logo">Logo</div>
  <div className="nav">
    <a href="#home">Home</a>
    <a href="#about">About</a>
  </div>
</div>`,
            after: `<header className="header" role="banner">
  <div className="logo">
    <img src="/logo.svg" alt="Company Logo" />
  </div>
  <nav className="nav" role="navigation" aria-label="Main navigation">
    <a href="#home" aria-current="page">Home</a>
    <a href="#about">About</a>
  </nav>
</header>`,
            explanation: 'Added semantic HTML elements (header, nav), ARIA labels, and proper alt text for better screen reader support and SEO.'
          }
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'UX Ray Analysis Results',
        text: `My website scored ${analysisResults?.score}/100 in UX analysis!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" 
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           fontFamily: '"Kalam", "Caveat", "Permanent Marker", "Comic Sans MS", cursive',
           filter: 'contrast(1.05) brightness(1.02)'
         }}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b-3 border-gray-400 sticky top-0 z-40"
           style={{ 
             boxShadow: '0 6px 12px -2px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
             borderStyle: 'dashed',
             borderWidth: '3px',
             background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
             backgroundSize: '8px 8px',
             backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-3 rounded-xl transform -rotate-3 shadow-lg border-3 border-dashed border-gray-400"
                   style={{ 
                     background: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
                     backgroundSize: '6px 6px',
                     backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px',
                     filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.2))'
                   }}>
                <img 
                  src="/lovable-uploads/3b674687-866c-479b-b5aa-b12c4f502463.png" 
                  alt="UX Ray Fish Skeleton Logo"
                  className="w-10 h-10 object-contain"
                  style={{ 
                    filter: 'contrast(1.2) brightness(0.8)',
                    transform: 'rotate(2deg)'
                  }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 transform -rotate-1"
                    style={{ 
                      textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
                      fontFamily: '"Kalam", "Permanent Marker", cursive',
                      letterSpacing: '-0.02em'
                    }}>
                  UX Ray
                </h1>
                <p className="text-sm text-gray-600 transform rotate-1" 
                   style={{ 
                     fontFamily: '"Caveat", "Comic Sans MS", cursive',
                     fontWeight: 600
                   }}>
                  AI-Powered Design Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {analysisResults && (
                <Button variant="outline" onClick={handleShare} 
                        className="bg-white/80 border-3 border-dashed border-gray-400 transform rotate-1 hover:rotate-0 transition-all duration-200 hover:scale-105"
                        style={{ 
                          fontFamily: '"Kalam", cursive',
                          fontWeight: 600,
                          boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                        }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              )}
              <Button variant="outline" 
                      className="bg-white/80 border-3 border-dashed border-gray-400 transform -rotate-1 hover:rotate-0 transition-all duration-200 hover:scale-105"
                      style={{ 
                        fontFamily: '"Kalam", cursive',
                        fontWeight: 600,
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 transform -rotate-1"
              style={{ 
                textShadow: '4px 4px 8px rgba(0,0,0,0.15)',
                fontFamily: '"Kalam", "Permanent Marker", cursive',
                letterSpacing: '-0.02em'
              }}>
            Analyze & Improve Your Design with AI
          </h2>
          
          {/* Enhanced Visual Description */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/90 backdrop-blur-sm border-3 border-dashed border-purple-400 hover:shadow-xl transition-all duration-300 transform hover:-rotate-2"
                    style={{ 
                      boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                      background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                      backgroundSize: '4px 4px',
                      backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-purple-400 transform rotate-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                    WCAG Compliance
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Accessibility audits with automated contrast, keyboard navigation, and screen reader testing
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Kalam", cursive' }}>AA/AAA Standards</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-3 border-dashed border-yellow-400 hover:shadow-xl transition-all duration-300 transform hover:rotate-2"
                    style={{ 
                      boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                      background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                      backgroundSize: '4px 4px',
                      backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-yellow-400 transform -rotate-2">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                    Performance Boost
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Core Web Vitals optimization with image compression and code splitting recommendations
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Kalam", cursive' }}>60% faster loading</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-3 border-dashed border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-rotate-1"
                    style={{ 
                      boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                      background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                      backgroundSize: '4px 4px',
                      backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-blue-400 transform rotate-1">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                    UX Patterns
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    User journey analysis with conversion optimization and behavioral insights
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Kalam", cursive' }}>+25% conversion</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-3 border-dashed border-green-400 hover:shadow-xl transition-all duration-300 transform hover:rotate-1"
                    style={{ 
                      boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                      background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                      backgroundSize: '4px 4px',
                      backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-green-400 transform -rotate-3">
                    <Code className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                    Code Quality
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Before/after code examples with security audits and maintainability improvements
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Kalam", cursive' }}>Enterprise ready</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Models Showcase */}
            <div className="bg-gradient-to-r from-gray-700 to-slate-800 rounded-xl p-6 text-white mb-6 border-3 border-dashed border-gray-500 transform -rotate-1"
                 style={{ 
                   boxShadow: '8px 8px 16px rgba(0,0,0,0.2)',
                   background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
                 }}>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Eye className="h-8 w-8" />
                <h3 className="text-xl font-bold" style={{ fontFamily: '"Kalam", cursive' }}>
                  Powered by Advanced AI
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-4 border-2 border-dashed border-white/30 transform rotate-1">
                  <h4 className="font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>GPT-4 Vision</h4>
                  <p className="text-sm text-gray-100" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>Visual design analysis and pattern recognition</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 border-2 border-dashed border-white/30 transform -rotate-1">
                  <h4 className="font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>Claude 3.5</h4>
                  <p className="text-sm text-gray-100" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>Code quality assessment and security auditing</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-xl text-gray-700 mb-4" style={{ fontFamily: '"Caveat", cursive', fontWeight: 600 }}>
                <strong>Get actionable insights</strong> with competitive comparisons and shareable reports
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span style={{ fontFamily: '"Kalam", cursive' }}>Instant analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span style={{ fontFamily: '"Kalam", cursive' }}>Export reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span style={{ fontFamily: '"Kalam", cursive' }}>Team collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Methods */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-3 border-dashed border-gray-400 shadow-xl transform rotate-1"
              style={{ 
                boxShadow: '8px 8px 16px rgba(0,0,0,0.15)',
                background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                backgroundSize: '6px 6px',
                backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px'
              }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ fontFamily: '"Kalam", cursive', fontSize: '24px' }}>
              <Upload className="h-5 w-5" />
              <span>Choose Analysis Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 border-3 border-dashed border-gray-400"
                       style={{ 
                         background: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                         backgroundSize: '4px 4px',
                         backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                       }}>
                <TabsTrigger value="url" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-500"
                           style={{ fontFamily: '"Kalam", cursive', fontWeight: 600 }}>
                  <LinkIcon className="h-4 w-4" />
                  <span>Website URL</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-500"
                           style={{ fontFamily: '"Kalam", cursive', fontWeight: 600 }}>
                  <FileImage className="h-4 w-4" />
                  <span>Upload Files</span>
                </TabsTrigger>
                <TabsTrigger value="figma" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-500"
                           style={{ fontFamily: '"Kalam", cursive', fontWeight: 600 }}>
                  <Figma className="h-4 w-4" />
                  <span>Figma Design</span>
                </TabsTrigger>
                <TabsTrigger value="project" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-500"
                           style={{ fontFamily: '"Kalam", cursive', fontWeight: 600 }}>
                  <Code className="h-4 w-4" />
                  <span>Full Project</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-3 border-dashed border-blue-300"
                     style={{ 
                       background: 'linear-gradient(45deg, #dbeafe 25%, transparent 25%), linear-gradient(-45deg, #dbeafe 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dbeafe 75%), linear-gradient(-45deg, transparent 75%, #dbeafe 75%)',
                       backgroundSize: '3px 3px',
                       backgroundPosition: '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
                     }}>
                  <h4 className="font-bold text-blue-900 mb-1" style={{ fontFamily: '"Kalam", cursive' }}>
                    Website URL Analysis
                  </h4>
                  <p className="text-sm text-blue-700" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Comprehensive analysis of live websites including accessibility compliance, performance metrics, SEO optimization, and competitive comparison with industry leaders.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1 border-3 border-dashed border-gray-400"
                    style={{ fontFamily: '"Kalam", cursive' }}
                  />
                  <Button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-gray-700 to-slate-800 text-white border-3 border-dashed border-gray-500 transform hover:-rotate-1 transition-all duration-200 hover:scale-105"
                    style={{ 
                      fontFamily: '"Kalam", cursive',
                      fontWeight: 600,
                      boxShadow: '3px 3px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                  </Button>
                </div>
                {websiteUrl && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-3 border-dashed border-blue-300"
                       style={{ 
                         fontFamily: '"Caveat", cursive', 
                         fontSize: '16px',
                         background: 'linear-gradient(45deg, #dbeafe 25%, transparent 25%), linear-gradient(-45deg, #dbeafe 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dbeafe 75%), linear-gradient(-45deg, transparent 75%, #dbeafe 75%)',
                         backgroundSize: '3px 3px',
                         backgroundPosition: '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
                       }}>
                    <p><strong>Sample Analysis:</strong> Click "Analyze Website" to see comprehensive design feedback including accessibility, performance, UX, and code quality insights with competitive benchmarking.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload">
                <div className="bg-green-50 p-4 rounded-lg mb-4 border-3 border-dashed border-green-300"
                     style={{ 
                       background: 'linear-gradient(45deg, #dcfce7 25%, transparent 25%), linear-gradient(-45deg, #dcfce7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dcfce7 75%), linear-gradient(-45deg, transparent 75%, #dcfce7 75%)',
                       backgroundSize: '3px 3px',
                       backgroundPosition: '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
                     }}>
                  <h4 className="font-bold text-green-900 mb-1" style={{ fontFamily: '"Kalam", cursive' }}>
                    File Upload Analysis
                  </h4>
                  <p className="text-sm text-green-700" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Upload images, PDFs, mockups, or wireframes for AI-powered design review. Generates detailed feedback on visual hierarchy, typography, color schemes, and layout optimization.
                  </p>
                </div>
                <FileUpload 
                  onFilesUploaded={setUploadedFiles}
                  onAnalyze={handleAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              </TabsContent>

              <TabsContent value="figma" className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg mb-4 border-3 border-dashed border-purple-300"
                     style={{ 
                       background: 'linear-gradient(45deg, #f3e8ff 25%, transparent 25%), linear-gradient(-45deg, #f3e8ff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3e8ff 75%), linear-gradient(-45deg, transparent 75%, #f3e8ff 75%)',
                       backgroundSize: '3px 3px',
                       backgroundPosition: '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
                     }}>
                  <h4 className="font-bold text-purple-900 mb-1" style={{ fontFamily: '"Kalam", cursive' }}>
                    Figma Design Analysis
                  </h4>
                  <p className="text-sm text-purple-700" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Connect your Figma account to analyze design files directly. Reviews component consistency, design system adherence, accessibility standards, and provides developer-friendly code suggestions.
                  </p>
                </div>
                <div className="text-center py-8">
                  <Figma className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                    Connect Figma Account
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: '"Caveat", cursive', fontSize: '18px' }}>Authorize access to analyze your Figma designs</p>
                  <Button 
                    onClick={handleAnalysis}
                    className="bg-gradient-to-r from-gray-700 to-slate-800 text-white border-3 border-dashed border-gray-500 transform hover:scale-105 transition-all duration-200"
                    style={{ 
                      fontFamily: '"Kalam", cursive',
                      fontWeight: 600,
                      boxShadow: '3px 3px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Connect Figma & Analyze'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg mb-4 border-3 border-dashed border-orange-300"
                     style={{ 
                       background: 'linear-gradient(45deg, #fed7aa 25%, transparent 25%), linear-gradient(-45deg, #fed7aa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fed7aa 75%), linear-gradient(-45deg, transparent 75%, #fed7aa 75%)',
                       backgroundSize: '3px 3px',
                       backgroundPosition: '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
                     }}>
                  <h4 className="font-bold text-orange-900 mb-1" style={{ fontFamily: '"Kalam", cursive' }}>
                    Full Project Analysis
                  </h4>
                  <p className="text-sm text-orange-700" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                    Upload complete project files (ZIP) for comprehensive code review. Analyzes React components, CSS architecture, performance bottlenecks, security vulnerabilities, and provides refactoring suggestions.
                  </p>
                </div>
                <div className="border-3 border-dashed border-gray-400 rounded-lg p-8 text-center"
                     style={{ 
                       background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                       backgroundSize: '4px 4px',
                       backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                     }}>
                  <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                    Upload Project Files
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: '"Caveat", cursive', fontSize: '18px' }}>
                    Upload a ZIP file containing your project for code analysis
                  </p>
                  <Button 
                    onClick={handleAnalysis}
                    variant="outline" 
                    className="cursor-pointer border-3 border-dashed border-gray-500 hover:scale-105 transition-all duration-200"
                    disabled={isAnalyzing}
                    style={{ 
                      fontFamily: '"Kalam", cursive',
                      fontWeight: 600,
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Select ZIP File & Analyze'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-6">
            <AnalysisResults results={analysisResults} />
            <AnnotationCanvas websiteUrl={websiteUrl} />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="bg-white/90 backdrop-blur-sm border-3 border-dashed border-gray-400 transform -rotate-1"
                style={{ 
                  boxShadow: '6px 6px 12px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                  backgroundSize: '5px 5px',
                  backgroundPosition: '0 0, 0 2.5px, 2.5px -2.5px, -2.5px 0px'
                }}>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-gray-600 mx-auto mb-4"
                     style={{ borderStyle: 'dashed' }}></div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                  Analyzing Design...
                </h3>
                <p className="text-gray-600" style={{ fontFamily: '"Caveat", cursive', fontSize: '18px' }}>Our AI models are evaluating your design and generating feedback</p>
                <div className="mt-4 space-y-2 text-sm text-gray-500" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                  <p>🔍 Scanning design elements with GPT-4 Vision...</p>
                  <p>🎨 Checking accessibility standards (WCAG 2.1)...</p>
                  <p>⚡ Analyzing performance metrics and Core Web Vitals...</p>
                  <p>📱 Evaluating user experience patterns...</p>
                  <p>🏆 Comparing with industry benchmarks...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        {!analysisResults && !isAnalyzing && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/80 backdrop-blur-sm border-3 border-dashed border-gray-400 transform rotate-2 hover:rotate-0 transition-all duration-300"
                  style={{ 
                    boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                    backgroundSize: '4px 4px',
                    backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                  }}>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-purple-400">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                  Advanced algorithms powered by GPT-4 Vision and Claude 3.5 analyze design patterns, accessibility, and user experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-3 border-dashed border-gray-400 transform -rotate-1 hover:rotate-0 transition-all duration-300"
                  style={{ 
                    boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                    backgroundSize: '4px 4px',
                    backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                  }}>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-blue-400">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                  Competitive Analysis
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                  Compare your design against industry leaders and get insights on how to outperform competitors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-3 border-dashed border-gray-400 transform rotate-1 hover:rotate-0 transition-all duration-300"
                  style={{ 
                    boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)',
                    backgroundSize: '4px 4px',
                    backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                  }}>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center border-3 border-dashed border-green-400">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: '"Kalam", cursive' }}>
                  Code Improvements
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"Caveat", cursive', fontSize: '16px' }}>
                  Receive actionable code suggestions with before/after examples to enhance performance and accessibility
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

