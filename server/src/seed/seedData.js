require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../../src/config/db');

const School = require('../models/School');
const User = require('../models/User');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const { FeeStructure, FeePayment } = require('../models/Fee');
const { Book } = require('../models/Library');
const { Vehicle, Route } = require('../models/Transport');
const Notification = require('../models/Notification');
const { SchoolFaq } = require('../models/Chat');
const { getGrade, calculateGPA } = require('../utils/calculations');

const seedDatabase = async () => {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
        School.deleteMany(), User.deleteMany(), Student.deleteMany(), Staff.deleteMany(),
        Class.deleteMany(), Subject.deleteMany(), Attendance.deleteMany(), Exam.deleteMany(),
        Result.deleteMany(), FeeStructure.deleteMany(), FeePayment.deleteMany(), Book.deleteMany(),
        Vehicle.deleteMany(), Route.deleteMany(), Notification.deleteMany(), SchoolFaq.deleteMany(),
    ]);

    // --- Super Admin ---
    const superAdmin = await User.create({
        name: 'Super Admin', email: 'superadmin@edusync.com', password: 'Admin@123',
        role: 'superadmin', phone: '+91-9000000000',
    });
    console.log('✅ Super Admin created');

    // --- Schools ---
    const school1 = await School.create({
        name: 'Delhi Public School', code: 'DPS001',
        address: { street: '123 Education Lane', city: 'New Delhi', state: 'Delhi', zipCode: '110001' },
        phone: '+91-11-26001234', email: 'info@dpsnewdelhi.edu.in', principal: 'Dr. Rajesh Kumar',
        board: 'CBSE', establishedYear: 1972,
        subscription: { plan: 'premium', startDate: new Date(), endDate: new Date('2026-12-31'), isActive: true },
    });
    const school2 = await School.create({
        name: 'St. Mary\'s International School', code: 'SMIS01',
        address: { street: '456 Knowledge Park', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
        phone: '+91-22-28001234', email: 'info@stmarys.edu.in', principal: 'Sr. Catherine D\'Souza',
        board: 'ICSE', establishedYear: 1985,
        subscription: { plan: 'basic', startDate: new Date(), endDate: new Date('2026-12-31'), isActive: true },
    });
    console.log('✅ 2 Schools created');

    // --- School 1 Admin ---
    const adminUser1 = await User.create({
        name: 'Priya Sharma', email: 'admin@dps.edu.in', password: 'Admin@123',
        role: 'schooladmin', schoolId: school1._id, phone: '+91-9876543210',
    });
    const adminStaff1 = await Staff.create({
        employeeId: 'DPS-ADM-001', user: adminUser1._id, schoolId: school1._id,
        department: 'Administration', designation: 'Principal',
        qualification: 'PhD in Education', experience: 20,
        salary: { basic: 80000, allowances: 20000, deductions: 5000 },
    });

    // --- Maintenance Head ---
    const maintenanceUser = await User.create({
        name: 'Ramesh Maintenance', email: 'maintenance@dps.edu.in', password: 'Maintenance@123',
        role: 'maintenance', schoolId: school1._id, phone: '+91-9876543222',
    });
    console.log('✅ Maintenance User created');

    // --- Teachers for School 1 ---
    const teacherNames = [
        { name: 'Amit Patel', email: 'amit.patel@dps.edu.in', dept: 'Mathematics', subject: 'Mathematics' },
        { name: 'Sunita Reddy', email: 'sunita.reddy@dps.edu.in', dept: 'Science', subject: 'Science' },
        { name: 'Rahul Verma', email: 'rahul.verma@dps.edu.in', dept: 'English', subject: 'English' },
        { name: 'Meena Gupta', email: 'meena.gupta@dps.edu.in', dept: 'Hindi', subject: 'Hindi' },
        { name: 'Vikram Singh', email: 'vikram.singh@dps.edu.in', dept: 'Social Studies', subject: 'Social Studies' },
    ];
    const teachers = [];
    for (const t of teacherNames) {
        const u = await User.create({ name: t.name, email: t.email, password: 'Teacher@123', role: 'teacher', schoolId: school1._id });
        const s = await Staff.create({
            employeeId: `DPS-T-${teachers.length + 1}`.padStart(10, '0'),
            user: u._id, schoolId: school1._id, department: t.dept,
            designation: 'Senior Teacher', qualification: 'M.Ed', experience: 8 + teachers.length,
            salary: { basic: 45000, allowances: 10000, deductions: 3000 },
        });
        teachers.push({ user: u, staff: s, subject: t.subject });
    }
    console.log('✅ 5 Teachers created');

    // --- Classes ---
    const classNames = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
        'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const classes = [];
    for (let i = 0; i < classNames.length; i++) {
        const cls = await Class.create({
            name: classNames[i], section: 'A', schoolId: school1._id,
            classTeacher: teachers[i % teachers.length].staff._id, capacity: 40,
        });
        classes.push(cls);
    }
    console.log('✅ 10 Classes created');

    // --- Subjects per class ---
    const subjectList = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'];
    const allSubjects = [];
    for (const cls of classes) {
        for (let i = 0; i < subjectList.length; i++) {
            const sub = await Subject.create({
                name: subjectList[i], code: `${cls.name.replace('Grade ', 'G')}-${subjectList[i].substring(0, 3).toUpperCase()}`,
                class: cls._id, teacher: teachers[i].staff._id, schoolId: school1._id,
                type: 'core', creditHours: subjectList[i] === 'Mathematics' ? 2 : 1,
            });
            allSubjects.push(sub);
        }
    }
    console.log('✅ 50 Subjects created');

    // --- Students for Grade 5 and Grade 10 ---
    const studentData = [
        { name: 'Arjun Mehta', email: 'arjun.m@student.dps.edu.in', classIdx: 4, roll: 1 },
        { name: 'Priya Iyer', email: 'priya.i@student.dps.edu.in', classIdx: 4, roll: 2 },
        { name: 'Rohan Das', email: 'rohan.d@student.dps.edu.in', classIdx: 4, roll: 3 },
        { name: 'Ananya Krishnan', email: 'ananya.k@student.dps.edu.in', classIdx: 4, roll: 4 },
        { name: 'Karthik Nair', email: 'karthik.n@student.dps.edu.in', classIdx: 4, roll: 5 },
        { name: 'Ravi Kumar', email: 'ravi.k@student.dps.edu.in', classIdx: 9, roll: 1 },
        { name: 'Sita Patel', email: 'sita.p@student.dps.edu.in', classIdx: 9, roll: 2 },
        { name: 'Dev Sharma', email: 'dev.s@student.dps.edu.in', classIdx: 9, roll: 3 },
        { name: 'Lakshmi Rao', email: 'lakshmi.r@student.dps.edu.in', classIdx: 9, roll: 4 },
        { name: 'Arun Joshi', email: 'arun.j@student.dps.edu.in', classIdx: 9, roll: 5 },
    ];

    const students = [];
    for (const sd of studentData) {
        const su = await User.create({ name: sd.name, email: sd.email, password: 'Student@123', role: 'student', schoolId: school1._id });
        // Create parent
        const pu = await User.create({
            name: `Parent of ${sd.name}`, email: `parent.${sd.email}`, password: 'Parent@123',
            role: 'parent', schoolId: school1._id,
        });
        const student = await Student.create({
            admissionNo: `DPS-2025-${String(students.length + 1).padStart(3, '0')}`,
            user: su._id, schoolId: school1._id, class: classes[sd.classIdx]._id,
            section: 'A', rollNo: sd.roll, dateOfBirth: new Date(2012, Math.floor(Math.random() * 12), 15),
            gender: students.length % 2 === 0 ? 'Male' : 'Female', bloodGroup: 'O+',
            guardian: {
                fatherName: `Mr. ${sd.name.split(' ')[1]}`, motherName: `Mrs. ${sd.name.split(' ')[1]}`,
                guardianPhone: `+91-98765${String(43210 + students.length)}`, guardianEmail: `parent.${sd.email}`
            },
            parentUser: pu._id, status: 'active',
        });
        students.push({ user: su, student, parent: pu });
    }
    console.log('✅ 10 Students + Parents created');

    // --- Attendance (last 5 days for Grade 5) ---
    const today = new Date();
    for (let d = 0; d < 5; d++) {
        const date = new Date(today); date.setDate(date.getDate() - d);
        for (const s of students.filter((_, i) => i < 5)) {
            await Attendance.create({
                student: s.student._id, class: classes[4]._id, date,
                status: Math.random() > 0.15 ? 'present' : 'absent',
                markedBy: teachers[0].user._id, schoolId: school1._id,
            });
        }
    }
    console.log('✅ Attendance records created');

    // --- Exam + Results for Grade 5 ---
    const g5Subjects = allSubjects.filter((s) => s.class.toString() === classes[4]._id.toString());
    const exam = await Exam.create({
        name: 'Mid-Term Examination 2025', type: 'midterm', class: classes[4]._id,
        subjects: g5Subjects.map((s) => ({ subject: s._id, maxMarks: 100, passingMarks: 35 })),
        startDate: new Date('2025-10-01'), endDate: new Date('2025-10-10'),
        schoolId: school1._id, isPublished: true,
    });

    for (const s of students.filter((_, i) => i < 5)) {
        const marks = g5Subjects.map((sub) => {
            const obtained = Math.floor(Math.random() * 40) + 60;
            const pct = (obtained / 100) * 100;
            const { grade, gradePoint } = getGrade(pct);
            return { subject: sub._id, marksObtained: obtained, maxMarks: 100, grade, gradePoint };
        });
        const total = marks.reduce((s, m) => s + m.marksObtained, 0);
        const maxTotal = marks.reduce((s, m) => s + m.maxMarks, 0);
        const pct = Math.round((total / maxTotal) * 100 * 100) / 100;
        const gpa = calculateGPA(marks);
        const { grade: og } = getGrade(pct);
        await Result.create({
            student: s.student._id, exam: exam._id, marks,
            totalMarks: total, totalMaxMarks: maxTotal, percentage: pct, gpa, overallGrade: og,
            schoolId: school1._id,
        });
    }
    console.log('✅ Exam + Results created');

    // --- Fee Structures ---
    const feeG5 = await FeeStructure.create({
        name: 'Grade 5 Annual Fee 2025-26', class: classes[4]._id,
        components: [
            { name: 'Tuition Fee', amount: 60000 },
            { name: 'Lab Fee', amount: 5000 },
            { name: 'Library Fee', amount: 3000 },
            { name: 'Activity Fee', amount: 7000 },
        ],
        totalAmount: 75000, dueDate: new Date('2025-07-31'), frequency: 'annually', schoolId: school1._id,
    });
    for (const s of students.filter((_, i) => i < 5)) {
        await FeePayment.create({
            student: s.student._id, feeStructure: feeG5._id,
            amount: Math.random() > 0.3 ? 75000 : 37500,
            method: 'online', status: 'paid', schoolId: school1._id,
        });
    }
    console.log('✅ Fee structures + payments created');

    // --- Library ---
    const books = [
        { title: 'Mathematics for Class 5', author: 'R.D. Sharma', category: 'textbook', totalCopies: 30, availableCopies: 25 },
        { title: 'NCERT Science Class 5', author: 'NCERT', category: 'textbook', totalCopies: 30, availableCopies: 28 },
        { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', category: 'fiction', totalCopies: 10, availableCopies: 7 },
        { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'non-fiction', totalCopies: 8, availableCopies: 5 },
        { title: 'The Story of My Experiments with Truth', author: 'M.K. Gandhi', category: 'non-fiction', totalCopies: 5, availableCopies: 4 },
        { title: 'Digital Mathematics Workbook', author: 'EduSync', category: 'textbook', isDigital: true, digitalUrl: 'https://example.com/math-workbook.pdf', totalCopies: 999, availableCopies: 999 },
        { title: 'Interactive Science Encyclopedia', author: 'EduSync', category: 'reference', isDigital: true, digitalUrl: 'https://example.com/science-enc.pdf', totalCopies: 999, availableCopies: 999 },
    ];
    for (const b of books) await Book.create({ ...b, schoolId: school1._id });
    console.log('✅ Library books created');

    // --- Transport ---
    const v1 = await Vehicle.create({
        vehicleNumber: 'DL-01-AB-1234', type: 'bus', capacity: 50,
        driverName: 'Ramesh Kumar', driverPhone: '+91-9876000001', schoolId: school1._id,
    });
    const v2 = await Vehicle.create({
        vehicleNumber: 'DL-01-CD-5678', type: 'van', capacity: 15,
        driverName: 'Suresh Singh', driverPhone: '+91-9876000002', schoolId: school1._id,
    });
    await Route.create({
        name: 'Route 1 - South Delhi', vehicle: v1._id, monthlyFee: 3000,
        stops: [
            { name: 'Saket Metro Station', time: '7:15 AM', order: 1 },
            { name: 'Green Park', time: '7:30 AM', order: 2 },
            { name: 'Hauz Khas', time: '7:45 AM', order: 3 },
            { name: 'School', time: '8:00 AM', order: 4 },
        ], schoolId: school1._id,
    });
    await Route.create({
        name: 'Route 2 - East Delhi', vehicle: v2._id, monthlyFee: 2500,
        stops: [
            { name: 'Laxmi Nagar', time: '7:00 AM', order: 1 },
            { name: 'Preet Vihar', time: '7:20 AM', order: 2 },
            { name: 'School', time: '7:50 AM', order: 3 },
        ], schoolId: school1._id,
    });
    console.log('✅ Transport vehicles + routes created');

    // --- Notifications ---
    await Notification.create({
        title: 'Welcome to EduSync!', message: 'Welcome to the new academic year 2025-2026. We wish all students a great year ahead!',
        type: 'general', priority: 'high',
        recipients: { roles: ['schooladmin', 'teacher', 'student', 'parent'] },
        sender: adminUser1._id, schoolId: school1._id,
    });
    await Notification.create({
        title: 'Mid-Term Results Published', message: 'Mid-term examination results are now available. Please check your portal.',
        type: 'academic', priority: 'high',
        recipients: { roles: ['student', 'parent'] },
        sender: adminUser1._id, schoolId: school1._id,
    });
    console.log('✅ Notifications created');

    // --- School FAQs ---
    const faqs = [
        { q: 'What are the school timings?', a: 'School operates from 8:00 AM to 3:00 PM, Monday to Friday. Saturday is 8:00 AM to 12:30 PM.', kw: ['timing', 'time', 'hours', 'schedule'], cat: 'general' },
        { q: 'How to apply for admission?', a: 'Visit our Admissions page or contact the office at +91-11-26001234. Admissions for 2025-2026 are currently open.', kw: ['admission', 'apply', 'enroll', 'register'], cat: 'admission' },
        { q: 'What is the fee structure?', a: 'Annual fees range from ₹60,000 to ₹90,000 depending on the grade. Check the Fees section for details.', kw: ['fee', 'fees', 'payment', 'cost', 'price'], cat: 'fee' },
        { q: 'Is transport available?', a: 'Yes! We have bus and van services covering South Delhi and East Delhi. Monthly fee is ₹2,500-₹3,000.', kw: ['transport', 'bus', 'van', 'route', 'pick'], cat: 'transport' },
        { q: 'What board is the school affiliated to?', a: 'Delhi Public School is affiliated to CBSE (Central Board of Secondary Education).', kw: ['board', 'cbse', 'affiliation', 'curriculum'], cat: 'academic' },
    ];
    for (const f of faqs) {
        await SchoolFaq.create({ question: f.q, answer: f.a, keywords: f.kw, category: f.cat, schoolId: school1._id, priority: 10 });
    }
    console.log('✅ School FAQs created');

    console.log('\n🎉 Seed complete! Demo Credentials:');
    console.log('─'.repeat(45));
    console.log('Super Admin:  superadmin@edusync.com / Admin@123');
    console.log('School Admin: admin@dps.edu.in / Admin@123');
    console.log('Teacher:      amit.patel@dps.edu.in / Teacher@123');
    console.log('Student:      arjun.m@student.dps.edu.in / Student@123');
    console.log('Parent:       parent.arjun.m@student.dps.edu.in / Parent@123');
    console.log('─'.repeat(45));

    process.exit(0);
};

seedDatabase().catch((err) => { console.error('Seed error:', err); process.exit(1); });
