
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Globe, Zap, Users, Target, TrendingUp } from "lucide-react";
import AnalysisResults from "@/components/AnalysisResults";
import { AnalysisService, type AnalysisResult } from "@/services/analysisService";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to analyze",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., example.com or https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log('Starting analysis for:', fullUrl);
      
      const analysisResult = await AnalysisService.analyzeWebsite(fullUrl);
      console.log('Analysis completed:', analysisResult);
      
      setResults(analysisResult);
      
      toast({
        title: "Analysis Complete!",
        description: `Website scored ${analysisResult.score}/100`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong during analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              UX Ray
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            AI-Powered Website Design Analysis
          </p>
          <p className="text-gray-500">
            Get instant insights into your website's user experience, accessibility, and performance
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold text-sm">Website Scanning</h3>
              <p className="text-xs text-gray-600 mt-1">Deep analysis of design patterns</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-sm">Performance Insights</h3>
              <p className="text-xs text-gray-600 mt-1">Speed and optimization tips</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold text-sm">UX Analysis</h3>
              <p className="text-xs text-gray-600 mt-1">User experience evaluation</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold text-sm">Competitive Analysis</h3>
              <p className="text-xs text-gray-600 mt-1">Compare with industry leaders</p>
            </CardContent>
          </Card>
        </div>

        {/* URL Input */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>Analyze Website</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg py-3"
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !url}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {isAnalyzing && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="font-medium text-blue-900">Analyzing website...</p>
                    <p className="text-sm text-blue-700">This may take a few moments while we examine the design patterns.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="mb-8">
            <AnalysisResults results={results} />
          </div>
        )}

        {/* Sample Results */}
        {!results && !isAnalyzing && (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Sample Analysis</span>
                <Badge variant="outline" className="ml-2">Demo</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Enter a URL above to see a real analysis, or view this sample result:
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800">Example: E-commerce Site</h3>
                    <p className="text-sm text-green-700">Overall Score: 78/100</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Good</Badge>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="bg-white/50 p-2 rounded">
                    <div className="font-medium">UX: 82%</div>
                  </div>
                  <div className="bg-white/50 p-2 rounded">
                    <div className="font-medium">Performance: 74%</div>
                  </div>
                  <div className="bg-white/50 p-2 rounded">
                    <div className="font-medium">Accessibility: 80%</div>
                  </div>
                  <div className="bg-white/50 p-2 rounded">
                    <div className="font-medium">Code: 76%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
