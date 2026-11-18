import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

class ParentDashboardScreen extends StatefulWidget {
  const ParentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<ParentDashboardScreen> createState() => _ParentDashboardScreenState();
}

class _ParentDashboardScreenState extends State<ParentDashboardScreen> {
  int _selectedChildIndex = 0;

  final List<Map<String, dynamic>> _children = [
    {
      'name': 'Aarav Sharma',
      'admissionNo': 'APPS/2026/001',
      'class': 'Class 4 - Section A',
      'rollNo': 1,
      'attendance': '94.2%',
      'feeStatus': 'PENDING',
      'feeAmount': 1400,
      'feeMonth': 'May 2026',
      'examGrade': 'A1 (92%)',
    },
    {
      'name': 'Ananya Sharma',
      'admissionNo': 'APPS/2026/002',
      'class': 'Class 1 - Section B',
      'rollNo': 2,
      'attendance': '96.0%',
      'feeStatus': 'PAID',
      'feeAmount': 0,
      'feeMonth': 'All Clear',
      'examGrade': 'A1 (95%)',
    },
  ];

  void _showRazorpayPayDialog(Map<String, dynamic> child) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Razorpay Secure Checkout', style: TextStyle(color: Colors.white, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Student: ${child['name']}', style: const TextStyle(color: Colors.white70)),
            Text('Fee Month: ${child['feeMonth']}', style: const TextStyle(color: Colors.white70)),
            const SizedBox(height: 10),
            Text(
              'Payable: ₹${child['feeAmount']}',
              style: const TextStyle(color: Color(0xFF14B8A6), fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                child['feeStatus'] = 'PAID';
                child['feeAmount'] = 0;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Payment verified via Razorpay! Receipt REC-2026-98124 issued.'),
                  backgroundColor: Color(0xFF0D9488),
                ),
              );
            },
            child: const Text('Confirm & Pay', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showAiAssistant() {
    final textController = TextEditingController();
    String answer = '';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom,
            top: 20,
            left: 16,
            right: 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text('AI School Assistant', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                  IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close, color: Colors.white54)),
                ],
              ),
              const Text('Ask about school fees, timings, or CBSE grading.', style: TextStyle(color: Colors.white54, fontSize: 12)),
              const SizedBox(height: 12),
              if (answer.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(10)),
                  child: Text(answer, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                ),
              TextField(
                controller: textController,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'e.g. When is school fee due?',
                  hintStyle: const TextStyle(color: Colors.white30),
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF14B8A6)),
                    onPressed: () async {
                      final res = await ApiService.askAi(textController.text);
                      setModalState(() {
                        answer = res['data']['answer'] ?? 'Information retrieved.';
                      });
                    },
                  ),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentChild = _children[_selectedChildIndex];

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E1B4B),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('A. P PUBLIC SCHOOL', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
            Text('Parent Portal • Session 2026–27', style: TextStyle(fontSize: 11, color: Color(0xFF14B8A6))),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.smart_toy_outlined, color: Color(0xFF14B8A6)),
            onPressed: _showAiAssistant,
            tooltip: 'AI Assistant',
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white70),
            onPressed: () {
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const LoginScreen()));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome & Children Switcher
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF1E293B), Color(0xFF0F172A)]),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Welcome, Mr. Vikas Sharma', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                  const Text('Select child profile to view academic & fee records:', style: TextStyle(color: Colors.white54, fontSize: 11)),
                  const SizedBox(height: 12),
                  Row(
                    children: _children.asMap().entries.map((entry) {
                      final idx = entry.key;
                      final c = entry.value;
                      final isSelected = _selectedChildIndex == idx;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          selectedColor: const Color(0xFF0D9488),
                          backgroundColor: const Color(0xFF334155),
                          label: Text(c['name'], style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                          selected: isSelected,
                          onSelected: (val) {
                            if (val) setState(() => _selectedChildIndex = idx);
                          },
                        ),
                      );
                    }).toList(),
                  )
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Active Child Info Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white12),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: const Color(0xFF4F46E5),
                        child: Text(currentChild['name'][0], style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(currentChild['name'], style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            Text('Adm No: ${currentChild['admissionNo']} • Roll: ${currentChild['rollNo']}', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                            Text(currentChild['class'], style: const TextStyle(color: Color(0xFF14B8A6), fontSize: 12, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: Colors.white12, height: 24),

                  // 3 Metrics: Attendance, Fee, Grade
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(10)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Attendance', style: TextStyle(color: Colors.white54, fontSize: 10)),
                              const SizedBox(height: 2),
                              Text(currentChild['attendance'], style: const TextStyle(color: Colors.greenAccent, fontSize: 15, fontWeight: FontWeight.bold)),
                              const Text('Compliant', style: TextStyle(color: Colors.white38, fontSize: 9)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(10)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Tuition Dues', style: TextStyle(color: Colors.white54, fontSize: 10)),
                              const SizedBox(height: 2),
                              Text(
                                currentChild['feeStatus'] == 'PAID' ? '₹0' : '₹${currentChild['feeAmount']}',
                                style: TextStyle(
                                  color: currentChild['feeStatus'] == 'PAID' ? Colors.tealAccent : Colors.redAccent,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(currentChild['feeStatus'], style: const TextStyle(color: Colors.white38, fontSize: 9)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(10)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Mid-Term Exam', style: TextStyle(color: Colors.white54, fontSize: 10)),
                              const SizedBox(height: 2),
                              Text(currentChild['examGrade'], style: const TextStyle(color: Colors.amberAccent, fontSize: 14, fontWeight: FontWeight.bold)),
                              const Text('CBSE Grade', style: TextStyle(color: Colors.white38, fontSize: 9)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Online Pay Action Button
                  if (currentChild['feeStatus'] == 'PENDING') ...[
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0D9488),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        icon: const Icon(Icons.payment, size: 18),
                        label: Text('Pay ₹${currentChild['feeAmount']} via Razorpay', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        onPressed: () => _showRazorpayPayDialog(currentChild),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 16),

            // School Announcements
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('School Notices & Announcements', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  ListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.campaign, color: Color(0xFF14B8A6)),
                    title: const Text('Periodic Assessment 1 Schedule Released', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Exams commence from 15th May 2026. Please check syllabus.', style: TextStyle(color: Colors.white54, fontSize: 11)),
                  ),
                  const Divider(color: Colors.white12),
                  ListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.info_outline, color: Colors.indigoAccent),
                    title: const Text('Summer Timing in effect: 7:30 AM to 1:30 PM', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Buses depart at 1:40 PM. Second Saturdays are holidays.', style: TextStyle(color: Colors.white54, fontSize: 11)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
