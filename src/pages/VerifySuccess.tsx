import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the current session after email verification
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();

          setUserName(profile?.full_name || 'User');
          setStatus('success');

          // Auto-redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-healthcare-light/20 to-educational-light/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            )}
          </div>

          {status === 'loading' && (
            <>
              <CardTitle className="text-2xl">Verifying Email...</CardTitle>
              <CardDescription>
                Please wait while we verify your email address
              </CardDescription>
            </>
          )}

          {status === 'success' && (
            <>
              <CardTitle className="text-2xl">Email Verified!</CardTitle>
              <CardDescription>
                Welcome aboard, {userName}!
              </CardDescription>
            </>
          )}

          {status === 'error' && (
            <>
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
              <CardDescription>
                We couldn't verify your email address
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' && (
            <>
              <p className="text-center text-muted-foreground">
                Your email has been successfully verified. You're now logged in and will be redirected to the homepage shortly.
              </p>
              <Button
                className="w-full"
                onClick={() => navigate('/')}
              >
                Continue to Homepage
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="text-center text-muted-foreground">
                The verification link may have expired or is invalid. Please try requesting a new verification email.
              </p>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Back to Registration
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifySuccess;
