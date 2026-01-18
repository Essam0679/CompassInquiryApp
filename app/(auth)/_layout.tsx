<<<<<<< HEAD
// --- START OF FILE app/(auth)/_layout.tsx (Modified) ---

=======
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
      {/* 
        MODIFICATION: Removed explicit Stack.Screen definitions for login, register, and forgot-password.
        Expo Router will automatically create these routes from the files:
        - app/(auth)/login.tsx
        - app/(auth)/register.tsx
        - app/(auth)/forgot-password.tsx

        You would only need to keep them here if you were passing specific `options`
        to these Stack.Screen components, like:
        <Stack.Screen name="login" options={{ title: 'My Custom Login Title' }} />
        Since no options were being passed, they are considered extraneous by the warning.
      */}
      {/* <Stack.Screen name="login" /> */}
      {/* <Stack.Screen name="register" /> */}
      {/* <Stack.Screen name="forgot-password" /> */}
    </Stack>
  );
}
// --- END OF FILE app/(auth)/_layout.tsx (Modified) ---
=======
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
