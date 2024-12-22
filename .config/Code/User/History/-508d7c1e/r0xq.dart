import 'dart:io';
import 'dart:convert';
import 'package:path_provider/path_provider.dart';
import 'package:flutter/foundation.dart';

class FileHelper {
  // Get the local file path for liked movies
  Future<File> get _localLikedMoviesFile async {
    final directory = await getApplicationDocumentsDirectory();
    return File('${directory.path}/liked_movies.json');
  }

  // Read liked movies from JSON file
  Future<Set<Map<String, dynamic>>> readLikedMovies() async {
    try {
      final file = await _localLikedMoviesFile;

      // If file doesn't exist, return an empty set
      if (!await file.exists()) {
        return <Map<String, dynamic>>{};
      }

      // Read the file
      String contents = await file.readAsString();

      // Parse the JSON and convert to a Set to prevent duplicates
      List<dynamic> jsonList = json.decode(contents);
      return jsonList.map((item) => Map<String, dynamic>.from(item)).toSet();
    } catch (e) {
      debugPrint('Error reading liked movies: $e');
      return <Map<String, dynamic>>{};
    }
  }

  // Write liked movies to JSON file
  Future<void> writeLikedMovies(Set<Map<String, dynamic>> likedMovies) async {
    try {
      final file = await _localLikedMoviesFile;

      // Convert the set to a list for JSON serialization
      String jsonString = json.encode(likedMovies.toList());

      await file.writeAsString(jsonString);
    } catch (e) {
      debugPrint('Error writing liked movies: $e');
    }
  }

  // Remove a specific movie from liked movies
  Future<void> removeLikedMovie(int movieId) async {
    try {
      Set<Map<String, dynamic>> likedMovies = await readLikedMovies();

      // Remove the movie with the matching ID
      likedMovies.removeWhere((movie) => movie['id'] == movieId);

      await writeLikedMovies(likedMovies);
    } catch (e) {
      debugPrint('Error removing liked movie: $e');
    }
  }

  // Add a new liked movie
  Future<void> addLikedMovie(Map<String, dynamic> movie) async {
    try {
      Set<Map<String, dynamic>> likedMovies = await readLikedMovies();

      // Add the movie if it's not already in the set
      likedMovies.add(movie);

      await writeLikedMovies(likedMovies);
    } catch (e) {
      debugPrint('Error adding liked movie: $e');
    }
  }
}
