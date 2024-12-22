import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/welcome_screen.dart';
import 'services/theme_service.dart';
import 'services/file_helper.dart';
import 'services/http_helper.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        Provider<HttpHelper>(create: (_) => HttpHelper()),
        Provider<FileHelper>(create: (_) => FileHelper()),
      ],
      child: const MovieNightApp(),
    ),
  );
}

class MovieNightApp extends StatelessWidget {
  const MovieNightApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movie Night',
      theme: ThemeService.getAppTheme(),
      home: const WelcomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
