import { z } from 'zod';
import { Gender, StudentStatus } from '@prisma/client';

export const createStudentAdmissionSchema = z.object({
  admissionNo: z.string().min(3, 'Admission number is required'),
  rollNo: z.number().int().optional(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Valid Date of Birth is required' }),
  gender: z.nativeEnum(Gender),
  bloodGroup: z.string().optional(),
  category: z.string().optional().default('General'),
  aadhaarNo: z.string().optional(),
  classId: z.string().uuid('Valid Class ID is required'),
  sectionId: z.string().uuid('Valid Section ID is required'),
  
  // Parent details
  fatherName: z.string().min(2, "Father's name is required"),
  fatherPhone: z.string().min(10, "Father's phone must be at least 10 digits"),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(2, "Mother's name is required"),
  motherPhone: z.string().optional(),
  motherOccupation: z.string().optional(),
  parentEmail: z.string().email('Valid Parent Email is required for Portal login'),
  address: z.string().min(5, 'Full Residential Address is required'),
  city: z.string().default('Jhansi'),
  state: z.string().default('Uttar Pradesh'),
  pincode: z.string().default('284001'),
});

export const updateStudentSchema = createStudentAdmissionSchema.partial().extend({
  status: z.nativeEnum(StudentStatus).optional(),
});

export const promoteStudentSchema = z.object({
  studentIds: z.array(z.string().uuid()).min(1, 'Select at least one student'),
  targetClassId: z.string().uuid('Target class ID is required'),
  targetSectionId: z.string().uuid('Target section ID is required'),
  academicYearId: z.string().uuid('Target academic year is required'),
});
