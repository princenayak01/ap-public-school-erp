class ApiConfig {
  // For local Android Emulator, 10.0.2.2 maps to host localhost:5000
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1';

  // Endpoints
  static const String login = '$baseUrl/auth/login';
  static const String me = '$baseUrl/auth/me';
  static const String parentChildren = '$baseUrl/parent/my-children';
  static const String parentChildDetails = '$baseUrl/parent/children';
  static const String feePayRazorpay = '$baseUrl/fees/razorpay/create-order';
  static const String verifyRazorpay = '$baseUrl/fees/razorpay/verify';
  static const String markAttendance = '$baseUrl/attendance/daily';
  static const String examReport = '$baseUrl/exams';
  static const String aiAsk = '$baseUrl/ai/ask';

  // Branding
  static const String schoolName = 'A. P PUBLIC SCHOOL';
  static const String board = 'CBSE Affiliated';
  static const String location = 'Baruasagar, Jhansi (UP)';
  static const String academicSession = '2026–27';
}
