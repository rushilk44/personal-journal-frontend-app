
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testConnection, BASE_URL } from "@/services/api";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

const ConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    setErrorDetails(null);
    
    try {
      console.log('Testing connection to backend...');
      const isConnected = await testConnection();
      setConnectionStatus(isConnected);
      if (isConnected) {
        console.log('✅ Backend connection successful');
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      setConnectionStatus(false);
      setErrorDetails(error.message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleTestRegistration = async () => {
    setIsTestingConnection(true);
    setErrorDetails(null);
    
    try {
      console.log('Testing registration endpoint...');
      const testUser = {
        userName: "testuser" + Date.now(),
        email: "test@example.com",
        password: "testpass123",
        sentimentAnalysis: true
      };
      
      const response = await fetch(`${BASE_URL}/public/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testUser)
      });
      
      console.log('Registration test response status:', response.status);
      console.log('Registration test response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        console.log('✅ Registration endpoint working');
        setConnectionStatus(true);
      } else {
        const errorText = await response.text();
        console.log('❌ Registration test failed:', errorText);
        setConnectionStatus(false);
        setErrorDetails(`Registration failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Registration test error:', error);
      setConnectionStatus(false);
      setErrorDetails(`Registration test error: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Backend Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Backend URL:</p>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">{BASE_URL}</code>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="w-full"
            variant="outline"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Health Check...
              </>
            ) : (
              "Test Health Endpoint"
            )}
          </Button>
          
          <Button 
            onClick={handleTestRegistration}
            disabled={isTestingConnection}
            className="w-full"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Registration...
              </>
            ) : (
              "Test Registration Endpoint"
            )}
          </Button>
        </div>
        
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
        
        {errorDetails && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Error Details:</p>
                <p className="mt-1 break-words">{errorDetails}</p>
              </div>
            </div>
          </div>
        )}
        
        {connectionStatus === false && (
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Troubleshooting checklist:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>✅ Spring Boot backend running on http://localhost:8081</li>
              <li>✅ Context path set to '/journal'</li>
              <li>❓ CORS configured to allow http://localhost:3000 and https://*.lovableproject.com</li>
              <li>❓ Health endpoint available at /journal/public/health</li>
              <li>❓ Registration endpoint at /journal/public/create-user</li>
              <li>❓ No firewall blocking requests</li>
            </ul>
            
            <div className="mt-3 p-2 bg-blue-50 rounded">
              <p className="text-xs font-medium text-blue-800">Spring Boot CORS Config:</p>
              <pre className="text-xs text-blue-700 mt-1 whitespace-pre-wrap">
{`@CrossOrigin(origins = {"http://localhost:3000", "https://*.lovableproject.com"})
// or in application.properties:
// spring.web.cors.allowed-origins=http://localhost:3000,https://*.lovableproject.com`}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionTest;
