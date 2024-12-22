import 'package:flutter/foundation.dart'; // For defaultTargetPlatform
import 'package:flutter/material.dart';
import 'package:device_info_plus/device_info_plus.dart';
import '../widgets/custom_app_bar.dart';
import 'share_code_screen.dart';
import 'enter_code_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  Future<String> _getDeviceId() async {
    final deviceInfo = DeviceInfoPlugin();
    if (defaultTargetPlatform == TargetPlatform.android) {
      final androidInfo = await deviceInfo.androidInfo;
      return androidInfo.androidId ??
          'UnknownDevice'; // Unique Android device ID
    } else if (defaultTargetPlatform == TargetPlatform.iOS) {
      final iosInfo = await deviceInfo.iosInfo;
      return iosInfo.identifierForVendor ??
          'UnknownDevice'; // Unique iOS device ID
    } else {
      return 'UnsupportedPlatform';
    }
  }

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
              onPressed: () async {
                final deviceId = await _getDeviceId();
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ShareCodeScreen(deviceId: deviceId),
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

extension on AndroidDeviceInfo {
  get androidId => null;
}
