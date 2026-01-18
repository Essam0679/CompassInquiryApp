<<<<<<< HEAD
// --- START OF FILE MultiForm.tsx (Corrected Version) ---

=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
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
<<<<<<< HEAD
  submitButtonText?: string; // This prop allows custom text for the submit button
=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
}

export default function MultiForm({ 
  forms, 
  activeForm, 
  onNext, 
  onPrevious, 
  isLastStep,
  colors,
<<<<<<< HEAD
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
=======
  t
}: MultiFormProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.formContainer, { zIndex: 1000 }]}>
        {forms[activeForm]}
      </View>
      
      {!isLastStep && (
        <View style={[styles.navigationButtons, { zIndex: 0 }]}>
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
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
          
<<<<<<< HEAD
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
=======
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={onNext}
          >
            <Text style={[styles.navButtonText, { color: colors.white }]}>
              {t('next')}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
            </Text>
            <ArrowRight size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
<<<<<<< HEAD
=======
      )}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    // This component no longer needs flex: 1 as its parent ScrollView handles layout
=======
    flex: 1,
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
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
<<<<<<< HEAD
    flex: 1, // This makes the button grow to fill available space
=======
    flex: 1,
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
    marginLeft: 16,
  },
  navButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginHorizontal: 8,
  },
<<<<<<< HEAD
});
// --- END OF FILE MultiForm.tsx (Corrected Version) ---
=======
});
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
