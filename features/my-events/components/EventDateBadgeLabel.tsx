import { Text, View } from 'react-native';
import { TicketmasterText } from '@/components/ui/TicketmasterText';
import { getEventBadgeDateParts } from '@/lib/event-datetime';
import { colors } from '@/theme/tokens';

const DATE_FONT_SIZE = 18;
const DOT_FONT_SIZE = DATE_FONT_SIZE * 2;

const dateTextStyle = {
  color: colors.white,
  fontSize: DATE_FONT_SIZE,
  lineHeight: 22,
  fontWeight: '700' as const,
  letterSpacing: 0.3,
};

export interface EventDateBadgeLabelProps {
  eventDate: string;
  eventTime: string;
}

export function EventDateBadgeLabel({ eventDate, eventTime }: EventDateBadgeLabelProps) {
  const parts = getEventBadgeDateParts(eventDate, eventTime);
  const fullLabel = parts.join(' · ');

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={fullLabel}
      style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}
    >
      {parts.map((part, index) => (
        <View key={`${part}-${index}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {index > 0 ? (
            <Text
              accessible={false}
              style={{
                color: colors.white,
                fontSize: DOT_FONT_SIZE,
                lineHeight: DOT_FONT_SIZE,
                fontWeight: '700',
                // Extra space before the time (after year).
                marginHorizontal: index === 1 || index === parts.length - 1 ? 3 : 1,
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
            >
              ·
            </Text>
          ) : null}
          <TicketmasterText
            fontSize={DATE_FONT_SIZE}
            color={colors.white}
            commaOffsetY={1}
            style={dateTextStyle}
          >
            {part}
          </TicketmasterText>
        </View>
      ))}
    </View>
  );
}
