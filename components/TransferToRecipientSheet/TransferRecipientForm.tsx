import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { TransferTicketSummary } from '@/components/TransferToRecipientSheet/TransferTicketSummary';
import { Typography } from '@/components/ui/Typography';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

export interface TransferRecipientFormValues {
  firstName: string;
  lastName: string;
  contact: string;
  note: string;
}

export interface TransferRecipientFormRef {
  getValues: () => TransferRecipientFormValues;
}

export interface TransferRecipientFormProps {
  tickets: EventTicket[];
  ticketMode: TicketMode;
}

export const TransferRecipientForm = memo(
  forwardRef<TransferRecipientFormRef, TransferRecipientFormProps>(function TransferRecipientForm(
    { tickets, ticketMode },
    ref,
  ) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [note, setNote] = useState('');

    useImperativeHandle(
      ref,
      () => ({
        getValues: () => ({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          contact: contact.trim(),
          note: note.trim(),
        }),
      }),
      [contact, firstName, lastName, note],
    );

    return (
      <BottomSheetScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TransferTicketSummary tickets={tickets} ticketMode={ticketMode} />

        <View style={styles.fields}>
          <Field
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoComplete="given-name"
          />
          <Field
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoComplete="family-name"
          />
          <Field
            label="Email or Mobile Number"
            value={contact}
            onChangeText={setContact}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Field
            label="Note"
            value={note}
            onChangeText={setNote}
            multiline
            style={styles.noteInput}
          />
        </View>
      </BottomSheetScrollView>
    );
  }),
);

TransferRecipientForm.displayName = 'TransferRecipientForm';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  style?: object;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

const Field = memo(function Field({
  label,
  value,
  onChangeText,
  multiline = false,
  style,
  autoCapitalize,
  autoComplete,
  keyboardType,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Typography style={styles.label}>{label}</Typography>
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.neutral[400]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete as never}
        keyboardType={keyboardType}
        style={[styles.input, style]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  fields: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.neutral[950],
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: radius.sm,
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.neutral[950],
    fontSize: 15,
  },
  noteInput: {
    height: 110,
    paddingTop: spacing.md,
  },
});
