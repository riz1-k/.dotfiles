import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/http_helper.dart';
import '../widgets/custom_app_bar.dart';
import 'welcome_screen.dart';

class ShareCodeScreen extends StatefulWidget {
  const ShareCodeScreen({super.key});

  @override
  _ShareCodeScreenState createState() => _ShareCodeScreenState();
}

class _ShareCodeScreenState extends State<ShareCodeScreen> {
  String? _sessionCode;
  final HttpHelper _httpHelper = HttpHelper();

  @override
  void initState() {
    super.initState();
    _generateSessionCode();
  }

  Future<void> _generateSessionCode() async {
    try {
      final sessionId = await _httpHelper.createSession();
      setState(() {
        _sessionCode = sessionId;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error creating session: $e')),
      );
    }
  }

  void _copyToClipboard() {
    if (_sessionCode != null) {
      Clipboard.setData(ClipboardData(text: _sessionCode!));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Session code copied to clipboard')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Share Session Code'),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Your Session Code:',
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 16),
            _sessionCode != null
                ? Text(
                    _sessionCode!,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : const CircularProgressIndicator(),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _sessionCode != null ? _copyToClipboard : null,
              child: const Text('Copy Code'),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const WelcomeScreen()),
                  (route) => false,
                );
              },
              child: const Text('OK'),
            ),
          ],
        ),
      ),
    );
  }
}
