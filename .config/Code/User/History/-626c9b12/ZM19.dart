import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class HttpHelper {
  static const String tmdbBaseUrl = 'https://api.themoviedb.org/3';
  static const String movieNightBaseUrl = 'YOUR_MOVIENIGHT_API_BASE_URL';

  // TODO: Replace with your actual API keys
  static const String tmdbApiKey = 'YOUR_TMDB_API_KEY';
  static const String movieNightApiKey = 'YOUR_MOVIENIGHT_API_KEY';

  // Fetch initial movies from TMDB
  Future<List<dynamic>> fetchMovies({int page = 1}) async {
    try {
      final response = await http.get(
        Uri.parse('$tmdbBaseUrl/discover/movie?api_key=$tmdbApiKey&page=$page'),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['results'];
      } else {
        debugPrint('Failed to load movies: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching movies: $e');
      return [];
    }
  }

  // Create a new session with MovieNight API
  Future<String?> createSession() async {
    try {
      final response = await http.post(
        Uri.parse('$movieNightBaseUrl/sessions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $movieNightApiKey',
        },
      );

      if (response.statusCode == 201) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['session_id'];
      } else {
        debugPrint('Failed to create session: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      debugPrint('Error creating session: $e');
      return null;
    }
  }

  // Submit a vote for a movie
  Future<bool> submitVote({
    required String sessionId,
    required int movieId,
    required bool liked,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$movieNightBaseUrl/vote'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $movieNightApiKey',
        },
        body: json.encode({
          'session_id': sessionId,
          'movie_id': movieId,
          'liked': liked,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error submitting vote: $e');
      return false;
    }
  }
}
