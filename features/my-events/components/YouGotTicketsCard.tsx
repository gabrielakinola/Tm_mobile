import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Share } from 'lucide-react-native';
import { TicketmasterText } from '@/components/ui/TicketmasterText';
import { Typography } from '@/components/ui/Typography';
import {
  EventDateBadgeOverlay,
  getScaledEventDateBadgeDotFontSize,
} from '@/features/my-events/components/EventDateBadgeOverlay';
import { MY_EVENT_CARD_DARK_BG } from '@/features/my-events/components/MyEventCard';
import { resolveVenueDisplay } from '@/features/my-events/utils/event-detail';
import type { MyEventDetail } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const MINI_IMAGE_ASPECT_RATIO = 1.15 / 0.64;
const MINI_DATE_FONT_SIZE = 14;
const MINI_DATE_DOT_FONT_SIZE = getScaledEventDateBadgeDotFontSize(MINI_DATE_FONT_SIZE);
const VENUE_COLOR = '#C8C8C8';
const VENUE_FONT_SIZE = 11;
const SOCIAL_BG = '#F0F0F0';

export interface YouGotTicketsCardProps {
  event: Pick<
    MyEventDetail,
    'name' | 'imageUrl' | 'eventDate' | 'eventTime' | 'venue' | 'location'
  >;
  onSharePress?: () => void;
}

function MiniDateBadge({
  eventDate,
  eventTime,
  containerWidth,
}: {
  eventDate: string;
  eventTime: string;
  containerWidth: number;
}) {
  return (
    <EventDateBadgeOverlay
      eventDate={eventDate}
      eventTime={eventTime}
      containerWidth={containerWidth}
      layout="card"
      fontSize={MINI_DATE_FONT_SIZE}
      dotFontSize={MINI_DATE_DOT_FONT_SIZE}
      shrinkToFit
      compactHeight
    />
  );
}

export function YouGotTicketsCard({ event, onSharePress }: YouGotTicketsCardProps) {
  const { venue } = resolveVenueDisplay(event.venue, event.location);
  const [miniImageWidth, setMiniImageWidth] = useState(0);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.banner}>
          <Image
            source={{ uri: event.imageUrl }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            blurRadius={80}
          />
          <View style={[StyleSheet.absoluteFillObject, styles.bannerDim]} />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.bannerContent}>
            <View style={styles.miniCard}>
              <View
                style={styles.miniImageWrap}
                onLayout={(event) => {
                  const nextWidth = event.nativeEvent.layout.width;
                  if (nextWidth > 0 && nextWidth !== miniImageWidth) {
                    setMiniImageWidth(nextWidth);
                  }
                }}
              >
                <Image
                  source={{ uri: event.imageUrl }}
                  style={styles.miniImage}
                  contentFit="cover"
                  transition={200}
                />
                {miniImageWidth > 0 ? (
                  <MiniDateBadge
                    eventDate={event.eventDate}
                    eventTime={event.eventTime}
                    containerWidth={miniImageWidth}
                  />
                ) : null}
              </View>

              <View style={styles.miniInfo}>
                <Typography style={styles.miniTitle} numberOfLines={3}>
                  {event.name}
                </Typography>
                <TicketmasterText
                  fontSize={VENUE_FONT_SIZE}
                  color={VENUE_COLOR}
                  numberOfLines={1}
                  style={styles.miniVenue}
                >
                  {venue}
                </TicketmasterText>
              </View>
            </View>

            <View style={styles.gotTicketsBlock}>
              <Typography style={styles.gotTicketsText}>YOU GOT TICKETS!</Typography>
              <View style={styles.gotTicketsDivider} />
            </View>
          </View>
        </View>

        <View style={styles.socialSection}>
          <Typography style={styles.socialTitle}>Post on Social Media</Typography>
          <Typography style={styles.socialBody}>
            Build hype for the event, and share that you got tickets with your friends and family.
          </Typography>
        </View>
      </View>

      <View style={styles.shareSection}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share you're going"
          onPress={onSharePress}
          style={({ pressed }) => [styles.sharePressable, pressed && styles.sharePressed]}
        >
          <View style={styles.shareContent}>
            <Typography numberOfLines={1} style={styles.shareLabel}>
              Share You’re Going
            </Typography>
            <Share size={13} color={colors.neutral[800]} strokeWidth={2.2} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 1,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: SOCIAL_BG,
  },
  banner: {
    overflow: 'hidden',
  },
  bannerDim: {
    backgroundColor: 'rgba(20, 20, 20, 0.35)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
    gap: spacing.md,
  },
  miniCard: {
    flex: 0.6,
    backgroundColor: MY_EVENT_CARD_DARK_BG,
    overflow: 'hidden',
  },
  miniImageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: MINI_IMAGE_ASPECT_RATIO,
  },
  miniImage: {
    width: '100%',
    height: '100%',
  },
  miniInfo: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  miniTitle: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  miniVenue: {
    color: VENUE_COLOR,
    fontSize: VENUE_FONT_SIZE,
    lineHeight: 14,
    fontWeight: '400',
  },
  gotTicketsBlock: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: spacing.xs,
  },
  gotTicketsText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  gotTicketsDivider: {
    marginTop: spacing.sm,
    width: '80%',
    height: 3,
    backgroundColor: colors.white,
  },
  socialSection: {
    backgroundColor: SOCIAL_BG,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  socialTitle: {
    color: colors.neutral[950],
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
  },
  socialBody: {
    color: colors.neutral[700],
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  shareSection: {
    height: 50,
    backgroundColor: SOCIAL_BG,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharePressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  shareContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sharePressed: {
    opacity: 0.65,
  },
  shareLabel: {
    color: colors.neutral[900],
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    flexShrink: 0,
  },
});
