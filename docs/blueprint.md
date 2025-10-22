# **App Name**: PulseDrive

## Core Features:

- Live Camera Feed: Display a live video feed from the phone's front camera.
- PPG-Based Stress Analysis: Use the live camera feed to perform photoplethysmography (PPG) analysis, detecting driver stress levels using AI.
- Real-time Stress Indicator: Display a visual indicator of the driver's current stress level based on the PPG analysis.
- Weekly Trend Dashboard: Show a dashboard with weekly trends of driver stress, visualizing the data stored in Firestore.
- Personalized Tips: Offer personalized tips for stress reduction and fatigue prevention based on historical stress data. The tips are chosen with an LLM tool that can incorporate data from the weekly trends dashboard, to help in deciding the relevancy of each tip for the user
- Stress Alert: Trigger visual and/or audio alerts when high stress levels are detected. Alerts are enabled by setting up cloud functions.
- User Authentication: Securely authenticate users to access their data and personalized settings within the app using Firebase Authentication.

## Style Guidelines:

- Primary color: Dark ocean blue (#3B5998) evokes trust and safety for drivers.
- Background color: Very light desaturated blue (#E8F0FE) provides a calm, unobtrusive background.
- Accent color: Seafoam green (#3DDC84) to highlight important UI elements and reinforce the feeling of safety.
- Body and headline font: 'Inter' sans-serif for a clean, readable interface. Suitable for both headings and body text.
- Use clean, minimalist vector icons with rounded edges.
- Use a clear and intuitive layout, in the style of Material 3 design.
- Incorporate smooth transitions and animations to enhance user experience.