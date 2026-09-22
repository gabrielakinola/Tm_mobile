type ProfileName = {
  firstName?: string | null;
  lastName?: string | null;
};

export function formatProfileName(profile?: ProfileName | null): string {
  return [profile?.firstName?.trim(), profile?.lastName?.trim()].filter(Boolean).join(' ');
}

export function getProfileInitials(profile?: ProfileName | null): string {
  const first = profile?.firstName?.trim() ?? '';
  const last = profile?.lastName?.trim() ?? '';
  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }
  if (first) {
    return first.slice(0, 2).toUpperCase();
  }
  if (last) {
    return last.slice(0, 2).toUpperCase();
  }
  return '';
}
