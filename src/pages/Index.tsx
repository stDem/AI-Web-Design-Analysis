import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnalysisResults from '@/components/AnalysisResults';

import { useWebsiteAnalysis } from '@/hooks/useWebsiteAnalysis';
import WebsiteViewer from '@/components/WebsiteViewer';

const Index = () => {
  const [url, setUrl] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<string>("url");
  const { toast } = useToast();
  
  const { analyzeWebsite, isAnalyzing, results, clearResults } = useWebsiteAnalysis();

  const handleAnalyze = () => {
    if (analysisType === 'url' && url) {
      analyzeWebsite(url);
    } else {
      toast({
        title: "Coming Soon",
        description: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis will be available soon!`,
      });
    }
  };

  const handleClearResults = () => {
    clearResults();
  };

  return (
    <div className="container mx-auto py-12">
      <div className="grid gap-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isAnalyzing}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="analysisType">Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="code">Code Snippet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze Website"}
            </Button>

            {results && (
              <Button variant="secondary" onClick={handleClearResults}>
                Clear Results
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          {/* Results Section */}
          {results && (
            <div className="space-y-8">
              <AnalysisResults results={results} />
              
              {/* Website Viewer with Annotations */}
              {results.url && results.annotations && (
                <WebsiteViewer 
                  url={results.url} 
                  annotations={results.annotations}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
