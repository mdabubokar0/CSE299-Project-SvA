import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Redirect href="/(tabs)/Home" />;
}