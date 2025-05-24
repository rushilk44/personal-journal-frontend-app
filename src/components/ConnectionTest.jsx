
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testConnection, BASE_URL } from "@/services/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const ConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      const isConnected = await testConnection();
      setConnectionStatus(isConnected);
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Backend URL:</p>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{BASE_URL}</code>
        </div>
        
        <Button 
          onClick={handleTestConnection}
          disabled={isTestingConnection}
          className="w-full"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Backend Connection"
          )}
        </Button>
        
        {connectionStatus !== null && (
          <div className="flex items-center justify-center">
            {connectionStatus ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-4 w-4" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="mr-1 h-4 w-4" />
                Connection Failed
              </Badge>
            )}
          </div>
        )}
        
        {connectionStatus === false && (
          <div className="text-sm text-gray-600 space-y-2">
            <p>Troubleshooting tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Make sure your Spring Boot backend is running on port 8081</li>
              <li>Check if CORS is configured to allow requests from this domain</li>
              <li>Verify the backend URL is correct</li>
              <li>Check your network connection</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionTest;
