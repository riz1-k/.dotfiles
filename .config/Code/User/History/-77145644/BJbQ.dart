import 'package:flutter/foundation.dart';

class AppConstants {
  // API Endpoints
  static const String tmdbBaseUrl = 'https://api.themoviedb.org/3';
  static const String movieNightBaseUrl = 'https://your-movienight-api.com';

  // API Keys (replace with actual keys)
  static const String tmdbApiKey = 'your_tmdb_api_key';

  // Default Values
  static const String defaultPosterPath = 'assets/images/default_poster.png';

  // Debug Printing
  static void debugPrint(String message) {
    if (kDebugMode) {
      print(message);
    }
  }

  // Base Spacing Unit
  static const double baseSpacingUnit = 8.0;
}
