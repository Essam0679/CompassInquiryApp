import { View, Text, StyleSheet } from 'react-native';

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  colors: any;
}

export default function FormStepper({ steps, currentStep, colors }: FormStepperProps) {
  return (
    <View style={styles.stepper}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepContent}>
            <View 
              style={[
                styles.stepCircle, 
                { 
                  backgroundColor: currentStep >= index ? colors.primary : colors.backgroundSecondary,
                  borderColor: currentStep >= index ? colors.primary : colors.border,
                }
              ]}
            >
              <Text 
                style={[
                  styles.stepNumber, 
                  { color: currentStep >= index ? colors.white : colors.textSecondary }
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text 
              style={[
                styles.stepText, 
                { color: currentStep >= index ? colors.text : colors.textSecondary }
              ]}
              numberOfLines={1}
            >
              {step}
            </Text>
          </View>
          
          {index < steps.length - 1 && (
            <View 
              style={[
                styles.stepLine, 
                { backgroundColor: currentStep > index ? colors.primary : colors.border }
              ]} 
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepContent: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  stepNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: 80,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
});