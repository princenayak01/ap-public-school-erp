import { Request, Response, NextFunction } from 'express';
import datastore from '../utils/datastore';

const DEFAULT_TIMETABLE = [
  { id: 'tt-1', day: 'Monday', period: 1, time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacher: 'Sunita Sharma', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-2', day: 'Monday', period: 2, time: '09:15 AM - 10:00 AM', subject: 'Hindi Literature', teacher: 'Kamlesh Tiwari', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-3', day: 'Monday', period: 3, time: '10:00 AM - 10:45 AM', subject: 'English Grammar', teacher: 'Renu Gupta', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-4', day: 'Monday', period: 4, time: '11:15 AM - 12:00 PM', subject: 'General Science', teacher: 'Anil Verma', room: 'Science Lab', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-5', day: 'Monday', period: 5, time: '12:00 PM - 12:45 PM', subject: 'Social Studies', teacher: 'Priya Srivastava', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-6', day: 'Monday', period: 6, time: '01:15 PM - 02:00 PM', subject: 'Computer Applications', teacher: 'Vikas Dubey', room: 'IT Lab', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-7', day: 'Monday', period: 7, time: '02:00 PM - 02:40 PM', subject: 'Physical Education / Sports', teacher: 'Rajesh Yadav', room: 'Playground', className: 'Class 4', sectionName: 'A' },

  { id: 'tt-8', day: 'Tuesday', period: 1, time: '08:30 AM - 09:15 AM', subject: 'English Grammar', teacher: 'Renu Gupta', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-9', day: 'Tuesday', period: 2, time: '09:15 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Sunita Sharma', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-10', day: 'Tuesday', period: 3, time: '10:00 AM - 10:45 AM', subject: 'General Science', teacher: 'Anil Verma', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-11', day: 'Tuesday', period: 4, time: '11:15 AM - 12:00 PM', subject: 'Hindi Literature', teacher: 'Kamlesh Tiwari', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-12', day: 'Tuesday', period: 5, time: '12:00 PM - 12:45 PM', subject: 'Social Studies', teacher: 'Priya Srivastava', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-13', day: 'Tuesday', period: 6, time: '01:15 PM - 02:00 PM', subject: 'Art & Craft', teacher: 'Sunita Sharma', room: 'Art Room', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-14', day: 'Tuesday', period: 7, time: '02:00 PM - 02:40 PM', subject: 'Library & Reading', teacher: 'Library Incharge', room: 'Library', className: 'Class 4', sectionName: 'A' },

  { id: 'tt-15', day: 'Wednesday', period: 1, time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacher: 'Sunita Sharma', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-16', day: 'Wednesday', period: 2, time: '09:15 AM - 10:00 AM', subject: 'General Science', teacher: 'Anil Verma', room: 'Science Lab', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-17', day: 'Wednesday', period: 3, time: '10:00 AM - 10:45 AM', subject: 'English Grammar', teacher: 'Renu Gupta', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-18', day: 'Wednesday', period: 4, time: '11:15 AM - 12:00 PM', subject: 'Hindi Literature', teacher: 'Kamlesh Tiwari', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-19', day: 'Wednesday', period: 5, time: '12:00 PM - 12:45 PM', subject: 'Computer Applications', teacher: 'Vikas Dubey', room: 'IT Lab', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-20', day: 'Wednesday', period: 6, time: '01:15 PM - 02:00 PM', subject: 'Social Studies', teacher: 'Priya Srivastava', room: 'Room 104', className: 'Class 4', sectionName: 'A' },
  { id: 'tt-21', day: 'Wednesday', period: 7, time: '02:00 PM - 02:40 PM', subject: 'Music & Dance', teacher: 'Guest Instructor', room: 'Activity Hall', className: 'Class 4', sectionName: 'A' },
];

export class TimetableController {
  static async getTimetable(req: Request, res: Response, next: NextFunction) {
    try {
      const className = req.query.className as string;
      const sectionName = req.query.sectionName as string;

      let list = datastore.getTimetable(className, sectionName);
      if (!list || list.length === 0) {
        list = DEFAULT_TIMETABLE;
        datastore.saveTimetable(DEFAULT_TIMETABLE);
      }

      return res.status(200).json({
        success: true,
        data: list,
      });
    } catch (err) {
      next(err);
    }
  }

  static async saveSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const slot = req.body;
      const existing = datastore.getTimetable() || [];
      const index = existing.findIndex((e: any) => e.id === slot.id || (e.day === slot.day && e.period === slot.period && e.className === slot.className));

      if (index >= 0) {
        existing[index] = { ...existing[index], ...slot };
      } else {
        existing.push({
          id: `tt-${Date.now().toString().slice(-4)}`,
          ...slot,
        });
      }

      datastore.saveTimetable(existing);
      return res.status(200).json({
        success: true,
        message: 'Timetable schedule slot updated successfully.',
        data: existing,
      });
    } catch (err) {
      next(err);
    }
  }

  static async bulkSave(req: Request, res: Response, next: NextFunction) {
    try {
      const { slots } = req.body;
      if (Array.isArray(slots)) {
        datastore.saveTimetable(slots);
        return res.status(200).json({
          success: true,
          message: `${slots.length} timetable periods updated successfully.`,
          data: slots,
        });
      }
      return res.status(400).json({ success: false, message: 'Invalid payload, expected array of slots.' });
    } catch (err) {
      next(err);
    }
  }
}
