import { ScrollView, View } from 'react-native';
import { Skeleton } from '@/components/ui';
import { APP_CARD_BG } from '@/constants/app-surface';
import { spacing } from '@/theme/tokens';

const BONE = '#2C2C2E';

function Bone({
  width,
  height,
  radius = 4,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
}) {
  return (
    <Skeleton
      width={width}
      height={height}
      style={{ backgroundColor: BONE, borderRadius: radius }}
    />
  );
}

function HomeForYouCardSkeleton() {
  return (
    <View
      style={{
        width: 300,
        marginRight: spacing.sm,
        backgroundColor: APP_CARD_BG,
        borderWidth: 1,
        borderColor: '#343434',
      }}
    >
      <View style={{ height: 180, backgroundColor: BONE }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 168,
            height: 39,
            backgroundColor: APP_CARD_BG,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Bone width="78%" height={14} />
        </View>
      </View>
      <View
        style={{
          minHeight: 62,
          paddingLeft: 12,
          paddingRight: 7,
          paddingVertical: 7,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{ width: 39, height: 43, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Bone width={24} height={10} />
          <Bone width={22} height={18} />
        </View>
        <View
          style={{
            flex: 1,
            minWidth: 0,
            height: 43,
            paddingLeft: 9,
            justifyContent: 'space-between',
          }}
        >
          <Bone width="72%" height={12} />
          <Bone width="88%" height={13} />
        </View>
      </View>
    </View>
  );
}

export function HomeForYouSkeletonRail() {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
    >
      {Array.from({ length: 3 }, (_, index) => (
        <HomeForYouCardSkeleton key={index} />
      ))}
    </ScrollView>
  );
}

function HomeTrendingRowSkeleton() {
  return (
    <View
      style={{
        height: 64,
        marginBottom: 7,
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          height: 64,
          marginLeft: 28,
          borderWidth: 1,
          borderColor: '#292929',
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <View style={{ width: 76, height: '100%', backgroundColor: BONE }} />
        <View style={{ flex: 1, minWidth: 0, paddingHorizontal: 12, gap: 8 }}>
          <Bone width="62%" height={14} />
          <Bone width="38%" height={11} />
        </View>
        <View style={{ width: 43, height: '100%', paddingRight: 16, justifyContent: 'center' }}>
          <Bone width={18} height={16} radius={9} />
        </View>
      </View>
      <View style={{ position: 'absolute', left: 4, top: 16 }}>
        <Bone width={28} height={28} />
      </View>
    </View>
  );
}

export function HomeTrendingSkeletonRail({ columnWidth }: { columnWidth: number }) {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
    >
      {Array.from({ length: 2 }, (_, column) => (
        <View key={column} style={{ width: columnWidth }}>
          {Array.from({ length: 3 }, (_, row) => (
            <HomeTrendingRowSkeleton key={row} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function HomeEventCardSkeleton({ width }: { width: number }) {
  const imageHeight = Math.round(width * 0.58);

  return (
    <View
      style={{
        width,
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: '#2D2D2D',
        backgroundColor: '#111111',
      }}
    >
      <View style={{ height: imageHeight, backgroundColor: BONE }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 96,
            height: 32,
            backgroundColor: '#111111',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Bone width={72} height={11} />
        </View>
      </View>
      <View style={{ minHeight: 78, paddingLeft: 10, paddingVertical: 8 }}>
        <Bone width="70%" height={14} />
        <View style={{ marginTop: 12 }}>
          <Bone width="86%" height={12} />
        </View>
      </View>
    </View>
  );
}

export function HomeEventRailSkeleton({ cardWidth }: { cardWidth: number }) {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
    >
      {Array.from({ length: 3 }, (_, index) => (
        <HomeEventCardSkeleton key={index} width={cardWidth} />
      ))}
    </ScrollView>
  );
}

function HomeJustAnnouncedCardSkeleton({ width }: { width: number }) {
  return (
    <View
      style={{
        width,
        height: width,
        marginRight: spacing.md,
        backgroundColor: '#111111',
        overflow: 'hidden',
      }}
    >
      <View style={{ flex: 1, backgroundColor: BONE }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 118,
            height: 34,
            backgroundColor: '#242424',
            justifyContent: 'center',
            paddingHorizontal: 14,
          }}
        >
          <Bone width={86} height={12} />
        </View>
      </View>
      <View
        style={{ paddingLeft: 14, paddingTop: 10, paddingBottom: 12, backgroundColor: '#242424' }}
      >
        <Bone width="64%" height={18} />
        <View style={{ width: 72, height: 3, marginTop: 7, backgroundColor: BONE }} />
        <View style={{ marginTop: 11 }}>
          <Bone width="78%" height={13} />
        </View>
      </View>
      <View
        style={{
          height: 52,
          borderTopWidth: 1,
          borderTopColor: '#2A2A2A',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 14 }}>
          <Bone width={108} height={14} />
        </View>
        <View
          style={{
            width: 52,
            height: '100%',
            borderLeftWidth: 1,
            borderLeftColor: '#2A2A2A',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bone width={16} height={16} />
        </View>
      </View>
    </View>
  );
}

export function HomeJustAnnouncedSkeletonRail({ cardWidth }: { cardWidth: number }) {
  return (
    <ScrollView
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
    >
      {Array.from({ length: 2 }, (_, index) => (
        <HomeJustAnnouncedCardSkeleton key={index} width={cardWidth} />
      ))}
    </ScrollView>
  );
}
