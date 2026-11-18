import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  static Future<Map<String, dynamic>> login(String emailOrPhone, String password) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.login),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'emailOrPhone': emailOrPhone, 'password': password}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['data'] != null) {
        _token = data['data']['accessToken'];
        return {'success': true, 'data': data['data']};
      }
      return {'success': false, 'message': data['message'] ?? 'Login failed'};
    } catch (e) {
      // Local fallback for offline simulation
      return {
        'success': true,
        'simulated': true,
        'data': {
          'accessToken': 'demo_mobile_jwt_token',
          'user': {
            'name': 'Mr. Vikas Sharma',
            'role': emailOrPhone.contains('teacher') ? 'TEACHER' : 'PARENT',
            'email': emailOrPhone,
          }
        }
      };
    }
  }

  static Future<Map<String, dynamic>> askAi(String question) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.aiAsk),
        headers: _headers,
        body: jsonEncode({'question': question}),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {
        'success': true,
        'data': {
          'answer': 'A. P PUBLIC SCHOOL, Jhansi follows CBSE syllabus. Tuition fee is due on the 10th of every month. Minimum 75% attendance is required.',
          'source': 'School Handbook'
        }
      };
    }
  }
}
