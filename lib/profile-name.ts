type ProfileName = {
  firstName?: string | null;
  lastName?: string | null;
};

export function formatProfileName(profile?: ProfileName | null): string {
  return [profile?.firstName?.trim(), profile?.lastName?.trim()].filter(Boolean).join(' ');
}
