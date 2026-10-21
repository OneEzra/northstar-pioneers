import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useToast } from '@/hooks/useToast';

/** Two steps: enter your email, then the 6-digit code that was emailed to you. */
export function EmailSignIn() {
  const { requestCode, verifyCode } = useOrganizer();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address) return;
    try {
      await requestCode.mutateAsync(address);
      setSentTo(address);
      setCode('');
    } catch (err) {
      toast({ title: "Couldn't send a code", description: err instanceof Error ? err.message : String(err), variant: 'destructive' });
    }
  };

  const submitCode = async (value: string) => {
    if (!sentTo || value.length !== 6) return;
    try {
      await verifyCode.mutateAsync({ email: sentTo, code: value });
    } catch (err) {
      setCode('');
      toast({ title: "That didn't work", description: err instanceof Error ? err.message : String(err), variant: 'destructive' });
    }
  };

  if (!sentTo) {
    return (
      <form onSubmit={sendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organizer-email">Email</Label>
          <Input
            id="organizer-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={requestCode.isPending || !email.trim()}>
          {requestCode.isPending ? 'Sending…' : 'Email me a code'}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        If <span className="font-semibold text-foreground">{sentTo}</span> is an organizer email, a 6-digit code is on its
        way. It expires in 10 minutes.
      </p>
      <div className="space-y-2">
        <Label htmlFor="organizer-code">Code</Label>
        <InputOTP
          id="organizer-code"
          maxLength={6}
          value={code}
          onChange={setCode}
          onComplete={submitCode}
          disabled={verifyCode.isPending}
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => submitCode(code)} disabled={verifyCode.isPending || code.length !== 6}>
          {verifyCode.isPending ? 'Checking…' : 'Sign in'}
        </Button>
        <Button variant="ghost" onClick={() => sendCode()} disabled={requestCode.isPending}>
          Send a new code
        </Button>
        <Button variant="ghost" onClick={() => setSentTo(null)}>
          Use a different email
        </Button>
      </div>
    </div>
  );
}
