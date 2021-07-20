import { useSession, signIn } from 'next-auth/client';
import { useEffect } from 'react';
import { useFlagsmith } from 'flagsmith-react';

export default function Auth({ children }) {
  const { identify, isIdentified, getTrait, setTrait } = useFlagsmith();
  const [session, loading] = useSession();
  const isUser = !!session?.user;

  // Identify user and set email trait if does not exist
  const identifyUser = async (id, email) => {
    await identify(id);
    const hasEmail = !!getTrait('email');
    if (!hasEmail) {
      setTrait('email', email);
    }
  };

  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, loading]);

  useEffect(() => {
    if (isUser && !isIdentified) {
      // In the example we don't save users in the database so we don't have id that should be used for identification
      // Instead we're going to use email as a trait and id
      identifyUser(session.user.email, session.user.email);
    }
  }, [isIdentified, identify, session, isUser]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div />;
}
