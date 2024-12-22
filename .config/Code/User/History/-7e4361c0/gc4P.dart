import 'package:flutter/material.dart';
import '../helpers/session_helper.dart';
import '../helpers/http_helper.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  _WelcomeScreenState createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final SessionHelper _sessionHelper = SessionHelper();
  final HttpHelper _httpHelper = HttpHelper();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Movie Night'),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite),
            onPressed: () {
              Navigator.pushNamed(context, '/liked-movies');
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Welcome to Movie Night!',
                style: Theme.of(context).textTheme.displayLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _startNewSession,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(200, 50),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Start New Session'),
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: _isLoading
                    ? null
                    : () {
                        Navigator.pushNamed(context, '/enter-code');
                      },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(200, 50),
                ),
                child: const Text('Enter Session Code'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _startNewSession() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Get or generate device ID
      await _sessionHelper.getDeviceId();

      // Create a new session
      final sessionId = await _httpHelper.createSession();

      if (sessionId != null) {
        // Save the session ID
        await _sessionHelper.saveSessionId(sessionId);

        // Navigate to movie voting screen
        Navigator.pushNamedAndRemoveUntil(
            context, '/movie-voting', (route) => false);
      } else {
        // Show error dialog
        _showErrorDialog('Failed to create session. Please try again.');
      }
    } catch (e) {
      _showErrorDialog('An unexpected error occurred.');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            child: const Text('Okay'),
            onPressed: () {
              Navigator.of(ctx).pop();
            },
          ),
        ],
      ),
    );
  }
}
