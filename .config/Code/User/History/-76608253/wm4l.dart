import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/movie.dart';
import '../utils/constants.dart';

class HttpHelper {
  // TMDB API Methods
  Future<List<Movie>> fetchMovies({int page = 1}) async {
    try {
      final response = await http.get(Uri.parse(
          '${AppConstants.tmdbBaseUrl}/discover/movie?api_key=${AppConstants.tmdbApiKey}&page=$page'));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return (data['results'] as List)
            .map((movieJson) => Movie.fromJson(movieJson))
            .toList();
      } else {
        throw Exception('Failed to load movies');
      }
    } catch (e) {
      AppConstants.debugPrint('Error fetching movies: $e');
      rethrow;
    }
  }

  // MovieNight API Methods
  Future<String> createSession() async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.movieNightBaseUrl}/session'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body)['session_id'];
      } else {
        throw Exception('Failed to create session');
      }
    } catch (e) {
      AppConstants.debugPrint('Error creating session: $e');
      rethrow;
    }
  }

  Future<void> submitVote(
      {required String sessionId,
      required int movieId,
      required bool isLiked}) async {
    try {
      final response = await http.post(
          Uri.parse('${AppConstants.movieNightBaseUrl}/vote'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({
            'session_id': sessionId,
            'movie_id': movieId,
            'is_liked': isLiked
          }));

      if (response.statusCode != 200) {
        throw Exception('Failed to submit vote');
      }
    } catch (e) {
      AppConstants.debugPrint('Error submitting vote: $e');
      rethrow;
    }
  }
}
