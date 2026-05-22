import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

import { PrismaClient, RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Marcelino School database...");

  // Permissions
  const permissions = [
    "students:read", "students:write", "teachers:read", "teachers:write",
    "parents:read", "parents:write", "classes:read", "classes:write",
    "courses:read", "courses:write", "attendance:read", "attendance:write",
    "grades:read", "grades:write", "assignments:read", "assignments:write",
    "exams:read", "exams:write", "fees:read", "fees:write",
    "payments:read", "payments:write", "reports:read", "settings:read", "settings:write",
    "library:read", "library:write", "hostel:read", "hostel:write",
    "transport:read", "transport:write", "inventory:read", "inventory:write",
    "hr:read", "hr:write", "payroll:read", "payroll:write",
  ];

  for (const perm of permissions) {
    const [resource, action] = perm.split(":");
    await prisma.permission.upsert({
      where: { resource_action: { resource, action } },
      update: {},
      create: { resource, action },
    });
  }

  // Roles
  const roleNames: RoleName[] = ["SUPER_ADMIN", "ADMIN", "FINANCE", "HR", "TEACHER", "STUDENT", "PARENT", "LIBRARIAN", "TRANSPORT", "HOSTEL"];
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }

  // School
  const school = await prisma.school.upsert({
    where: { slug: "marcelino" },
    update: {},
    create: {
      name: "Marcelino International Academy",
      slug: "marcelino",
      motto: "Excellence Through Education",
      email: "info@marcelino.edu",
      phone: "+256 700 000 001",
      address: "Plot 42, Education Avenue, Kampala, Uganda",
      website: "https://marcelino.edu",
      foundedYear: 1998,
      description: "A world-class institution nurturing future leaders through innovative education.",
    },
  });

  const campus = await prisma.campus.create({
    data: { schoolId: school.id, name: "Main Campus", address: "Kampala, Uganda", isMain: true },
  });

  const year = await prisma.academicYear.create({
    data: {
      schoolId: school.id,
      name: "2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-07-31"),
      isCurrent: true,
    },
  });

  const term = await prisma.term.create({
    data: {
      academicYearId: year.id,
      name: "Term 1",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-12-20"),
      isCurrent: true,
    },
  });

  const dept = await prisma.department.create({
    data: { schoolId: school.id, name: "Sciences", description: "Science Department" },
  });

  // Currency
  const ugx = await prisma.currency.create({
    data: { schoolId: school.id, code: "UGX", name: "Ugandan Shilling", symbol: "USh", isDefault: true },
  });
  await prisma.currency.create({
    data: { schoolId: school.id, code: "USD", name: "US Dollar", symbol: "$", isDefault: false },
  });
  await prisma.exchangeRate.create({
    data: { currencyId: ugx.id, rate: 1 },
  });

  // Classes
  const classes = await Promise.all(
    ["Grade 10A", "Grade 10B", "Grade 11A"].map((name, i) =>
      prisma.class.create({
        data: { schoolId: school.id, campusId: campus.id, name, gradeLevel: 10 + i, capacity: 40 },
      })
    )
  );

  const sections = await Promise.all(
    classes.map((c) => prisma.section.create({ data: { classId: c.id, name: "A" } }))
  );

  // Subjects & Courses
  const subjectNames = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "History", "Computer Science"];
  const subjects = await Promise.all(
    subjectNames.map((name, i) =>
      prisma.subject.create({
        data: { departmentId: dept.id, name, code: `SUB${i + 1}`, credits: 3 },
      })
    )
  );

  const courses = await Promise.all(
    subjects.map((s) =>
      prisma.course.create({
        data: { subjectId: s.id, title: `${s.name} - Advanced`, description: `Comprehensive ${s.name} course` },
      })
    )
  );

  const hash = await bcrypt.hash("Password@123", 12);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@marcelino.edu" },
    update: {},
    create: {
      email: "admin@marcelino.edu",
      firstName: "System",
      lastName: "Administrator",
      passwordHash: await bcrypt.hash("Admin@123456", 12),
      schoolId: school.id,
      emailVerified: true,
    },
  });

  const adminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id },
    });
  }

  // Teachers
  const teachers = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `teacher${i}@marcelino.edu`,
        firstName: `Teacher`,
        lastName: `${i}`,
        passwordHash: hash,
        schoolId: school.id,
      },
    });
    const teacherRole = await prisma.role.findUnique({ where: { name: "TEACHER" } });
    if (teacherRole) await prisma.userRole.create({ data: { userId: user.id, roleId: teacherRole.id } });
    const profile = await prisma.teacherProfile.create({
      data: { userId: user.id, employeeId: `TCH00${i}`, departmentId: dept.id, hireDate: new Date("2020-01-01") },
    });
    teachers.push({ user, profile });
    await prisma.classSubject.create({
      data: { classId: classes[i % 3].id, subjectId: subjects[i % subjects.length].id, teacherId: profile.id },
    });
  }

  // Students
  const students = [];
  for (let i = 1; i <= 15; i++) {
    const user = await prisma.user.create({
      data: {
        email: `student${i}@marcelino.edu`,
        firstName: `Student`,
        lastName: `${i}`,
        passwordHash: hash,
        schoolId: school.id,
      },
    });
    const studentRole = await prisma.role.findUnique({ where: { name: "STUDENT" } });
    if (studentRole) await prisma.userRole.create({ data: { userId: user.id, roleId: studentRole.id } });
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        studentId: `STU2025${String(i).padStart(3, "0")}`,
        classId: classes[i % 3].id,
        sectionId: sections[i % 3].id,
        admissionDate: new Date("2024-09-01"),
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
      },
    });
    students.push({ user, profile });
    await prisma.enrollment.create({
      data: { studentId: profile.id, academicYearId: year.id, classId: classes[i % 3].id },
    });
  }

  // Parents
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `parent${i}@marcelino.edu`,
        firstName: `Parent`,
        lastName: `${i}`,
        passwordHash: hash,
        schoolId: school.id,
      },
    });
    const parentRole = await prisma.role.findUnique({ where: { name: "PARENT" } });
    if (parentRole) await prisma.userRole.create({ data: { userId: user.id, roleId: parentRole.id } });
    const profile = await prisma.parentProfile.create({ data: { userId: user.id, occupation: "Professional" } });
    await prisma.parentStudentLink.create({
      data: { parentId: profile.id, studentId: students[i % students.length].profile.id, isPrimary: true },
    });
  }

  // Timetable
  for (const cls of classes) {
    for (let day = 1; day <= 5; day++) {
      for (let period = 0; period < 4; period++) {
        const subj = subjects[(day + period) % subjects.length];
        const teacher = teachers[(day + period) % teachers.length];
        await prisma.timetableSlot.create({
          data: {
            classId: cls.id,
            subjectId: subj.id,
            teacherId: teacher.profile.id,
            dayOfWeek: day,
            startTime: `${8 + period}:00`,
            endTime: `${8 + period + 1}:00`,
            room: `Room ${100 + period}`,
            meetLink: period === 0 ? "https://meet.google.com/abc-defg-hij" : undefined,
          },
        });
      }
    }
  }

  // Attendance & Grades
  for (const { profile } of students) {
    for (let d = 0; d < 20; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      await prisma.attendanceRecord.create({
        data: {
          studentId: profile.id,
          date,
          status: Math.random() > 0.1 ? "PRESENT" : "ABSENT",
          teacherId: teachers[0].profile.id,
        },
      });
    }
    for (const subj of subjects.slice(0, 4)) {
      await prisma.grade.create({
        data: {
          studentId: profile.id,
          teacherId: teachers[0].profile.id,
          termId: term.id,
          subject: subj.name,
          score: 60 + Math.random() * 35,
          maxScore: 100,
          grade: "B+",
        },
      });
    }
  }

  // Assignments
  for (const course of courses.slice(0, 3)) {
    const assignment = await prisma.assignment.create({
      data: {
        courseId: course.id,
        teacherId: teachers[0].profile.id,
        title: `${course.title} - Assignment 1`,
        description: "Complete all exercises",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxScore: 100,
        status: "PUBLISHED",
      },
    });
    for (const { profile } of students.slice(0, 5)) {
      await prisma.submission.create({
        data: {
          assignmentId: assignment.id,
          studentId: profile.id,
          status: Math.random() > 0.5 ? "SUBMITTED" : "PENDING",
          submittedAt: Math.random() > 0.5 ? new Date() : undefined,
        },
      });
    }
  }

  // Fee structure & invoices
  const feeStructure = await prisma.feeStructure.create({
    data: {
      schoolId: school.id,
      academicYearId: year.id,
      name: "Term 1 Fees 2025",
      totalAmount: 2500000,
      items: {
        create: [
          { name: "Tuition", amount: 2000000 },
          { name: "Activities", amount: 300000 },
          { name: "Technology", amount: 200000 },
        ],
      },
    },
  });

  for (const { profile } of students) {
    const status = Math.random() > 0.5 ? "PAID" : "PENDING";
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: `INV-2025-${profile.studentId}`,
        studentId: profile.id,
        termId: term.id,
        currencyId: ugx.id,
        subtotal: 2500000,
        total: 2500000,
        paidAmount: status === "PAID" ? 2500000 : 0,
        status,
        dueDate: new Date("2025-12-31"),
        items: [{ name: "Term 1 Fees", amount: 2500000 }],
      },
    });
    if (status === "PAID") {
      const payment = await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: 2500000,
          provider: "FLUTTERWAVE",
          providerRef: `FLW-${profile.studentId}`,
          status: "COMPLETED",
          paidAt: new Date(),
        },
      });
      await prisma.receipt.create({
        data: { paymentId: payment.id, invoiceId: invoice.id, receiptNo: `RCP-${profile.studentId}` },
      });
    }
  }

  // Library
  const books = [
    { title: "Advanced Mathematics", author: "Stewart", isbn: "978-001", copies: 10 },
    { title: "Physics Principles", author: "Halliday", isbn: "978-002", copies: 8 },
    { title: "Organic Chemistry", author: "Clayden", isbn: "978-003", copies: 6 },
    { title: "English Literature", author: "Norton", isbn: "978-004", copies: 12 },
  ];
  for (const book of books) {
    const b = await prisma.book.create({ data: { ...book, available: book.copies, category: "Textbook" } });
    await prisma.libraryLoan.create({
      data: {
        bookId: b.id,
        studentId: students[0].profile.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    });
  }

  // Hostel
  const hostel = await prisma.hostel.create({ data: { name: "Boys Hostel", gender: "male" } });
  const room = await prisma.hostelRoom.create({ data: { hostelId: hostel.id, number: "101", capacity: 4, floor: 1 } });
  await prisma.bedAssignment.create({
    data: { roomId: room.id, studentId: students[0].profile.id, bedNumber: "A1", startDate: new Date() },
  });

  // Transport
  const route = await prisma.route.create({
    data: { name: "Route A - Ntinda", stops: ["Ntinda", "Kisementi", "School"], fare: 150000 },
  });
  await prisma.vehicle.create({ data: { routeId: route.id, plateNumber: "UBA 123A", capacity: 45, driverName: "John Driver" } });
  await prisma.transportAssignment.create({
    data: { studentId: students[1].profile.id, routeId: route.id, pickupPoint: "Ntinda" },
  });

  // Inventory
  await prisma.inventoryItem.createMany({
    data: [
      { name: "Chalk Box", sku: "INV001", category: "Supplies", quantity: 50, minStock: 10 },
      { name: "A4 Paper Ream", sku: "INV002", category: "Supplies", quantity: 8, minStock: 15 },
      { name: "Lab Goggles", sku: "INV003", category: "Lab", quantity: 30, minStock: 10 },
    ],
  });

  // CMS Content
  const cmsPages = [
    { slug: "about", title: "About Us", content: "<h1>About Marcelino International Academy</h1><p>Founded in 1998, we are committed to excellence in education.</p>" },
    { slug: "admissions", title: "Admissions", content: "<h1>Join Our Community</h1><p>Applications are open for the 2025-2026 academic year.</p>" },
    { slug: "academics", title: "Academics", content: "<h1>Academic Excellence</h1><p>Our curriculum prepares students for global success.</p>" },
  ];
  for (const page of cmsPages) {
    await prisma.cmsPage.upsert({ where: { slug: page.slug }, update: page, create: page });
  }

  await prisma.blogPost.createMany({
    data: [
      { title: "Welcome to New Academic Year", slug: "welcome-2025", excerpt: "Exciting year ahead", content: "We welcome all students...", status: "PUBLISHED", publishedAt: new Date(), tags: ["news"] },
      { title: "Science Fair Winners", slug: "science-fair-2025", excerpt: "Celebrating innovation", content: "Our students excelled...", status: "PUBLISHED", publishedAt: new Date(), tags: ["events"] },
    ],
  });

  await prisma.event.createMany({
    data: [
      { title: "Annual Sports Day", description: "Inter-house sports competition", location: "School Grounds", startDate: new Date("2025-11-15"), category: "Sports" },
      { title: "Parent-Teacher Meeting", description: "Term 1 review", location: "Main Hall", startDate: new Date("2025-12-01"), category: "Academic" },
    ],
  });

  await prisma.galleryItem.createMany({
    data: [
      { title: "Campus View", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800", category: "Campus", order: 1 },
      { title: "Science Lab", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", category: "Facilities", order: 2 },
      { title: "Graduation", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800", category: "Events", order: 3 },
    ],
  });

  await prisma.faq.createMany({
    data: [
      { question: "What are the admission requirements?", answer: "Completed application form, previous school records, and entrance assessment.", category: "Admissions", order: 1 },
      { question: "How do I pay school fees?", answer: "Through the Parent Portal using Flutterwave, MTN MoMo, Airtel Money, or cards.", category: "Finance", order: 2 },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      { name: "Sarah Nakato", role: "Parent", content: "Marcelino has transformed my daughter's education. Excellent teachers and facilities.", rating: 5, featured: true },
      { name: "David Okello", role: "Alumni", content: "The foundation I received here prepared me for university and beyond.", rating: 5, featured: true },
    ],
  });

  await prisma.career.create({
    data: {
      title: "Mathematics Teacher",
      department: "Sciences",
      description: "Seeking experienced mathematics teacher for senior classes.",
      requirements: "Bachelor's in Mathematics, 3+ years experience",
      type: "Full-time",
      status: "PUBLISHED",
    },
  });

  await prisma.download.createMany({
    data: [
      { title: "Admission Form 2025", fileUrl: "/downloads/admission-form.pdf", category: "Admissions" },
      { title: "School Calendar", fileUrl: "/downloads/calendar.pdf", category: "Academic" },
    ],
  });

  await prisma.scholarship.create({
    data: { name: "Merit Scholarship", description: "For top performers", type: "percentage", value: 25, isPercentage: true },
  });

  await prisma.announcement.create({
    data: {
      title: "Term 1 Begins September 1st",
      content: "All students are expected to report by 8:00 AM.",
      audience: "all",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log("Seed completed!");
  console.log("Demo accounts (password: Password@123):");
  console.log("  Admin: admin@marcelino.edu / Admin@123456");
  console.log("  Teacher: teacher1@marcelino.edu");
  console.log("  Student: student1@marcelino.edu");
  console.log("  Parent: parent1@marcelino.edu");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
