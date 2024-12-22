import 'package:flutter/material.dart';
import '../widgets/custom_app_bar.dart';
import 'share_code_screen.dart';
import 'enter_code_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Movie Night'),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome to Movie Night!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ShareCodeScreen(),
                  ),
                );
              },
              child: const Text('Create Session'),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const EnterCodeScreen(),
                  ),
                );
              },
              child: const Text('Join Session'),
            ),
          ],
        ),
      ),
    );
  }
}
