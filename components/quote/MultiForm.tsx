// --- START OF FILE MultiForm.tsx (Corrected Version) ---

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';

interface MultiFormProps {
  forms: React.ReactNode[];
  activeForm: number;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  colors: any;
  t: (key: string) => string;
  submitButtonText?: string; // This prop allows custom text for the submit button
}

export default function MultiForm({ 
  forms, 
  activeForm, 
  onNext, 
  onPrevious, 
  isLastStep,
  colors,
  t,
  submitButtonText
}: MultiFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* This part renders the active step's form content */}
        {forms[activeForm]}
      </View>
      
      {/* 
        This is the corrected navigation section. 
        It is no longer wrapped in a conditional, so the buttons always appear.
        The text and action of the "Next" button change on the last step.
      */}
      <View style={styles.navigationButtons}>
          {/* "Previous" button only shows if not on the first step */}
          {activeForm > 0 && (
            <TouchableOpacity 
              style={[styles.navButton, styles.prevButton, { borderColor: colors.border }]}
              onPress={onPrevious}
            >
              <ArrowLeft size={20} color={colors.text} />
              <Text style={[styles.navButtonText, { color: colors.text }]}>
                {t('previous')}
              </Text>
            </TouchableOpacity>
          )}
          
          {/* This button is now both "Next" and "Submit" */}
          <TouchableOpacity 
            style={[
              styles.navButton, 
              styles.nextButton, 
              { backgroundColor: colors.primary },
              // If there's no "Previous" button, this button should take the full width
              activeForm === 0 ? { flexGrow: 1, marginLeft: 0 } : {}
            ]}
            onPress={onNext} // This prop now correctly calls handleSubmit on the last step from sea.tsx
          >
            <Text style={[styles.navButtonText, { color: colors.white }]}>
              {/* If it's the last step, show the submit text, otherwise show "Next" */}
              {isLastStep ? (submitButtonText || t('submit')) : t('next')}
            </Text>
            <ArrowRight size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // This component no longer needs flex: 1 as its parent ScrollView handles layout
  },
  formContainer: {
    marginBottom: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  prevButton: {
    borderWidth: 1,
  },
  nextButton: {
    flex: 1, // This makes the button grow to fill available space
    marginLeft: 16,
  },
  navButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginHorizontal: 8,
  },
});
// --- END OF FILE MultiForm.tsx (Corrected Version) ---
