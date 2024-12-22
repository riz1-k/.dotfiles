// In your app's main entry point or a dedicated utility class
import 'package:device_info_plus/device_info_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';

import 'package:uuid/uuid.dart';

Future<String> getDeviceId() async {
  final deviceInfo = DeviceInfoPlugin();
  String deviceId;

  if (Platform.isAndroid) {
    final androidInfo = await deviceInfo.androidInfo;
    deviceId = androidInfo.androidId ?? '';
  } else if (Platform.isIOS) {
    final iosInfo = await deviceInfo.iosInfo;
    deviceId = iosInfo.identifierForVendor ?? '';
  } else {
    // For web or other platforms, you can use a different approach
    deviceId = await _generateUniqueId();
  }

  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('deviceId', deviceId);
  return deviceId;
}

extension on AndroidDeviceInfo {
  get androidId => null;
}

Future<String> _generateUniqueId() async {
  // Use a package like 'uuid' to generate a unique identifier
  const uuid = Uuid();
  return uuid.v4();
}
