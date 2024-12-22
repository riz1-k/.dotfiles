import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:google_fonts/google_fonts.dart';

import 'screens/welcome_screen.dart';
import 'screens/share_code_screen.dart';
import 'screens/enter_code_screen.dart';
import 'screens/movie_voting_screen.dart';
import 'screens/liked_movies_screen.dart';

void main() {
  runApp(MovieNightApp());
}

class MovieNightApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movie Night',
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.dark(
          primary: Color(0xFF6200EE),
          onPrimary: Colors.white,
          background: Color(0xFF121212),
          onBackground: Colors.white,
        ),
        textTheme: TextTheme(
          displayLarge: GoogleFonts.roboto(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          bodyMedium: GoogleFonts.roboto(
            fontSize: 16,
            color: Colors.white70,
          ),
        ),
        appBarTheme: AppBarTheme(
          centerTitle: true,
          backgroundColor: Color(0xFF1F1F1F),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => WelcomeScreen(),
        '/share-code': (context) => ShareCodeScreen(),
        '/enter-code': (context) => EnterCodeScreen(),
        '/movie-voting': (context) => MovieVotingScreen(),
        '/liked-movies': (context) => LikedMoviesScreen(),
      },
    );
  }
}

// Debug print utility
void debugPrint(String message) {
  if (kDebugMode) {
    print(message);
  }
}