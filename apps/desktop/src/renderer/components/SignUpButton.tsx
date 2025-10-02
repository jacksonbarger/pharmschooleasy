import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';

export function SignUpButton() {
  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You might need to send user information here
        body: JSON.stringify({
          // For now, we'll use a placeholder. In a real app, you'd get this from your auth context.
          userId: 'clxshq1w0000008l2g1z2h3j4', 
          redirectUrl: window.location.href,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Failed to create Stripe checkout session');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <Button onClick={handleSignUp} variant="premium" size="lg">
      Sign Up Now for 1 Month Free
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}
