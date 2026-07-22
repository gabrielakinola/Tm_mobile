import { Redirect } from 'expo-router';

/** @deprecated Use /profiles — kept so old deep links still work. */
export default function ProfileLocationRedirect() {
  return <Redirect href="/profiles" />;
}
