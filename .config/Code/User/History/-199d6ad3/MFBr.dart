import 'dart:io';
import 'dart:convert';
import 'package:path_provider/path_provider.dart';
import '../models/movie.dart';

class FileHelper {
  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  }

  Future<File> get _likedMoviesFile async {
    final path = await _localPath;
    return File('$path/liked_movies.json');
  }

  Future<List<Movie>> getLikedMovies() async {
    try {
      final file = await _likedMoviesFile;

      if (!await file.exists()) {
        return [];
      }

      final contents = await file.readAsString();
      final List<dynamic> jsonList = json.decode(contents);

      return jsonList.map((json) => Movie.fromJson(json)).toSet().toList();
    } catch (e) {
      print('Error reading liked movies: $e');
      return [];
    }
  }

  Future<void> addLikedMovie(Movie movie) async {
    try {
      final file = await _likedMoviesFile;
      final currentLikedMovies = await getLikedMovies();

      // Prevent duplicates
      if (!currentLikedMovies.any((m) => m.id == movie.id)) {
        currentLikedMovies.add(movie);

        await file.writeAsString(
            json.encode(currentLikedMovies.map((m) => m.toJson()).toList()));
      }
    } catch (e) {
      print('Error adding liked movie: $e');
    }
  }

  Future<void> removeLikedMovie(int movieId) async {
    try {
      final file = await _likedMoviesFile;
      final currentLikedMovies = await getLikedMovies();

      currentLikedMovies.removeWhere((movie) => movie.id == movieId);

      await file.writeAsString(
          json.encode(currentLikedMovies.map((m) => m.toJson()).toList()));
    } catch (e) {
      print('Error removing liked movie: $e');
    }
  }
}
