import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const ApPublicSchoolApp());
}

class ApPublicSchoolApp extends StatelessWidget {
  const ApPublicSchoolApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'A. P PUBLIC SCHOOL, Jhansi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF1E1B4B),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5),
          brightness: Brightness.dark,
          secondary: const Color(0xFF0D9488),
        ),
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}
