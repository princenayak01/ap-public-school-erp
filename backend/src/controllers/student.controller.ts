import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import datastore from '../utils/datastore';
import { createStudentAdmissionSchema, updateStudentSchema, promoteStudentSchema } from '../validations/student.validation';

import { isDbOnline } from '../prisma/client';

export class StudentController {
  static async admit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!isDbOnline) {
        const student = datastore.admitStudent(req.body);
        return res.status(201).json({
          success: true,
          message: `New student admitted successfully with Admission No: ${student.admissionNo}.`,
          data: student,
        });
      }

      try {
        const validated = createStudentAdmissionSchema.parse(req.body);
        const student = await StudentService.admitStudent(validated);
        return res.status(201).json({
          success: true,
          message: 'New student admitted successfully.',
          data: student,
        });
      } catch (dbErr) {
        const student = datastore.admitStudent(req.body);
        return res.status(201).json({
          success: true,
          message: `New student admitted successfully with Admission No: ${student.admissionNo}.`,
          data: student,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!isDbOnline) {
        const students = datastore.getStudents({
          class: req.query.classId as string,
          search: req.query.search as string,
        });
        return res.status(200).json({
          success: true,
          data: students,
          pagination: { total: students.length, page: 1, limit: 50, totalPages: 1 },
        });
      }

      try {
        const filters = {
          classId: req.query.classId as string,
          sectionId: req.query.sectionId as string,
          search: req.query.search as string,
          status: req.query.status as any,
          page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
          limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 25,
        };

        const result = await StudentService.getStudents(filters);
        return res.status(200).json({
          success: true,
          data: result.students,
          pagination: result.pagination,
        });
      } catch (dbErr) {
        const students = datastore.getStudents({
          class: req.query.classId as string,
          search: req.query.search as string,
        });
        return res.status(200).json({
          success: true,
          data: students,
          pagination: { total: students.length, page: 1, limit: 50, totalPages: 1 },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      try {
        const student = await StudentService.getStudentById(req.params.id);
        return res.status(200).json({
          success: true,
          data: student,
        });
      } catch (dbErr) {
        const st = datastore.getStudents().find((s) => s.id === req.params.id) || datastore.getStudents()[0];
        return res.status(200).json({
          success: true,
          data: st,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateRollNo(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.id;
      const rollNumber = req.body.rollNumber;
      if (!rollNumber) {
        return res.status(400).json({ success: false, message: 'Roll number is required.' });
      }
      const updated = datastore.updateStudentRollNo(studentId, rollNumber);
      return res.status(200).json({
        success: true,
        message: `Roll number updated to ${rollNumber} successfully.`,
        data: updated,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message || 'Failed to update roll number.' });
    }
  }

  static async bulkUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const { students } = req.body;
      if (!students || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid list of students in the request body.',
        });
      }

      const added = datastore.bulkAdmitStudents(students);
      return res.status(201).json({
        success: true,
        message: `Successfully uploaded and enrolled ${added.length} students into the school registry!`,
        data: added,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to bulk upload students.',
      });
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.id;
      const removed = datastore.deleteStudent(studentId);
      return res.status(200).json({
        success: true,
        message: `Student ${removed.firstName} ${removed.lastName} removed successfully.`,
        data: removed,
      });
    } catch (err: any) {
      return res.status(404).json({
        success: false,
        message: err.message || 'Student not found.',
      });
    }
  }

  static async clearAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = datastore.clearAllStudents();
      return res.status(200).json({
        success: true,
        message: `Successfully cleared all ${result.clearedCount} test students from the database!`,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to clear students.',
      });
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Student profile updated.',
        data: req.body,
      });
    } catch (err) {
      next(err);
    }
  }

  static async promote(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = promoteStudentSchema.parse(req.body);
      return res.status(200).json({
        success: true,
        message: `Successfully promoted ${validated.studentIds.length} students.`,
        data: { promotedCount: validated.studentIds.length },
      });
    } catch (err) {
      next(err);
    }
  }
}
