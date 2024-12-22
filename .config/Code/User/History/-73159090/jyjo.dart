import 'package:shared_preferences/shared_preferences.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'dart:io';
import 'package:flutter/foundation.dart';

class SessionHelper {
  static const String _deviceIdKey = 'movie_night_device_id';
  static const String _sessionIdKey = 'movie_night_session_id';

  // Generate or retrieve device ID
  Future<String> getDeviceId() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check if device ID is already stored
    String? storedDeviceId = prefs.getString(_deviceIdKey);
    if (storedDeviceId != null) return storedDeviceId;

    // Generate a new device ID
    String deviceId = await _generateUniqueDeviceId();
    
    // Store the device ID
    await prefs.setString(_deviceIdKey, deviceId);
    
    return deviceId;
  }

  // Generate a unique device identifier
  Future<String> _generateUniqueDeviceId() async {
    final DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    
    try {
      if (Platform.isIOS) {
        final IosDeviceInfo iosInfo = await deviceInfo.iosInfo;
        return iosInfo.identifierForVendor ?? _generateFallbackId();
      } else if (Platform.isAndroid) {
        final AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
        return androidInfo.id ?? _generateFallbackId();
      }
    } catch (e) {
      debugPrint('Error getting device info: $e');
    }
    
    // Fallback method
    return _generateFallbackId();
  }

  // Fallback method to generate a unique ID
  String _generateFallbackId() {
    return DateTime.now().millisecondsSinceEpoch.toString();
  }

  // Store session ID
  Future<void> saveSessionId(String sessionId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sessionIdKey, sessionId);
  }

  // Retrieve stored session ID
  Future<String?> getSessionId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_sessionIdKey);
  }

  // Clear session ID
  Future<void> clearSessionId() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_sessionIdKey);
  }
}