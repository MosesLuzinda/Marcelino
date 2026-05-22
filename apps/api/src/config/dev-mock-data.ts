const now = new Date();
const iso = (d: Date) => d.toISOString();

export function studentDashboard() {
  return {
    student: { studentId: "STU2025001", class: { name: "Grade 10A" } },
    stats: { attendance: 18 },
    grades: [
      { subject: "Mathematics", score: 85, grade: "A", maxScore: 100 },
      { subject: "Physics", score: 78, grade: "B+", maxScore: 100 },
      { subject: "English", score: 92, grade: "A", maxScore: 100 },
    ],
    assignments: [
      { status: "SUBMITTED", assignment: { title: "Mathematics - Assignment 1", dueDate: iso(now) } },
      { status: "PENDING", assignment: { title: "Physics Lab Report", dueDate: iso(now) } },
    ],
    notifications: [
      { id: "n1", title: "Welcome back", body: "Term 2 has started", read: false, createdAt: iso(now) },
    ],
  };
}

export function mockSchedule() {
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  return days.flatMap((day, di) => [
    {
      id: `slot-${di}-1`,
      dayOfWeek: day,
      startTime: "08:00",
      endTime: "09:00",
      room: "Room 12",
      subject: { name: "Mathematics" },
      teacher: { user: { firstName: "Teacher", lastName: "One" } },
    },
    {
      id: `slot-${di}-2`,
      dayOfWeek: day,
      startTime: "10:00",
      endTime: "11:00",
      room: "Lab 2",
      subject: { name: "Physics" },
      teacher: { user: { firstName: "Teacher", lastName: "Two" } },
    },
  ]);
}

export function mockAttendance() {
  const records = Array.from({ length: 20 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return {
      id: `att-${i}`,
      date: iso(d),
      status: i % 5 === 0 ? "ABSENT" : "PRESENT",
      remarks: i % 5 === 0 ? "Sick leave" : null,
    };
  });
  const present = records.filter((r) => r.status === "PRESENT").length;
  return { records, summary: { total: records.length, present, rate: (present / records.length) * 100 } };
}

export function mockGrades() {
  return [
    { id: "g1", subject: "Mathematics", score: 85, maxScore: 100, grade: "A", termId: "term1", createdAt: iso(now) },
    { id: "g2", subject: "Physics", score: 78, maxScore: 100, grade: "B+", termId: "term1", createdAt: iso(now) },
    { id: "g3", subject: "English", score: 92, maxScore: 100, grade: "A", termId: "term1", createdAt: iso(now) },
    { id: "g4", subject: "Chemistry", score: 88, maxScore: 100, grade: "A", termId: "term1", createdAt: iso(now) },
  ];
}

export function mockAssignments() {
  return [
    {
      id: "sub1",
      status: "SUBMITTED",
      submittedAt: iso(now),
      assignment: { id: "a1", title: "Mathematics - Assignment 1", dueDate: iso(now), course: { title: "Math 10A" } },
    },
    {
      id: "sub2",
      status: "PENDING",
      submittedAt: null,
      assignment: { id: "a2", title: "Physics Lab Report", dueDate: iso(now), course: { title: "Physics 10A" } },
    },
    {
      id: "sub3",
      status: "GRADED",
      score: 90,
      assignment: { id: "a3", title: "English Essay", dueDate: iso(now), course: { title: "English 10A" } },
    },
  ];
}

export function mockExams() {
  return [
    {
      id: "ea1",
      score: 85,
      submittedAt: iso(now),
      exam: { id: "e1", title: "Mathematics Mid-Term", duration: 60, status: "COMPLETED" },
    },
    {
      id: "ea2",
      score: null,
      submittedAt: null,
      exam: { id: "e2", title: "Physics Quiz", duration: 30, status: "AVAILABLE" },
    },
  ];
}

export function mockStudentProfile() {
  return {
    id: "dev-student-user",
    email: "student1@marcelino.edu",
    firstName: "Student",
    lastName: "One",
    phone: "+256700000001",
    locale: "en",
    theme: "system",
    studentProfile: {
      studentId: "STU2025001",
      class: { name: "Grade 10A" },
      section: { name: "A" },
    },
  };
}

export function mockNotifications() {
  return [
    { id: "n1", title: "Welcome back", body: "Term 2 has started", read: false, createdAt: iso(now) },
    { id: "n2", title: "Assignment due", body: "Physics Lab Report due Friday", read: false, createdAt: iso(now) },
    { id: "n3", title: "Fee reminder", body: "Term fees due end of month", read: true, createdAt: iso(now) },
  ];
}

export function mockConversations() {
  return [
    {
      id: "conv1",
      title: "Mathematics - Teacher One",
      isGroup: false,
      updatedAt: iso(now),
      members: [
        { user: { id: "dev-student-1", firstName: "Student", lastName: "One", avatar: null } },
        { user: { id: "dev-teacher-1", firstName: "Teacher", lastName: "One", avatar: null } },
      ],
      messages: [{ id: "m1", content: "Please submit your assignment by Friday.", createdAt: iso(now) }],
    },
  ];
}

export function mockMessages(conversationId: string) {
  return [
    { id: "m1", content: "Please submit your assignment by Friday.", createdAt: iso(now), sender: { id: "dev-teacher-1", firstName: "Teacher", lastName: "One", avatar: null } },
    { id: "m2", content: "Thank you, I will submit it tomorrow.", createdAt: iso(now), sender: { id: "dev-student-1", firstName: "Student", lastName: "One", avatar: null } },
  ].map((m) => ({ ...m, conversationId }));
}

export function teacherDashboard() {
  return {
    teacher: { employeeId: "TCH001" },
    classes: [
      { class: { name: "Grade 10A" }, subject: { name: "Mathematics" } },
      { class: { name: "Grade 10B" }, subject: { name: "Physics" } },
    ],
    assignmentCount: 3,
    notifications: [{ id: "tn1", title: "Staff meeting", body: "Friday 3pm", read: false }],
  };
}

export function mockTeacherClasses() {
  return [
    {
      class: {
        id: "c1",
        name: "Grade 10A",
        students: [
          { id: "s1", user: { firstName: "Student", lastName: "One", email: "student1@marcelino.edu" } },
          { id: "s2", user: { firstName: "Student", lastName: "Two", email: "student2@marcelino.edu" } },
        ],
      },
      subject: { name: "Mathematics" },
    },
    {
      class: { id: "c2", name: "Grade 10B", students: [{ id: "s3", user: { firstName: "Student", lastName: "Three", email: "student3@marcelino.edu" } }] },
      subject: { name: "Physics" },
    },
  ];
}

export function mockTeacherAssignments() {
  return [
    { id: "ta1", title: "Algebra Worksheet", status: "PUBLISHED", dueDate: iso(now), course: { title: "Math 10A" }, submissions: [{ id: "sub1", status: "SUBMITTED" }] },
    { id: "ta2", title: "Physics Lab", status: "PUBLISHED", dueDate: iso(now), course: { title: "Physics 10B" }, submissions: [] },
  ];
}

export function mockTeacherAnalytics() {
  return [
    { subject: "Mathematics", average: 82.5, atRisk: false },
    { subject: "Physics", average: 71.2, atRisk: false },
    { subject: "Chemistry", average: 48.0, atRisk: true },
  ];
}

export function mockTeacherExams() {
  return [
    { id: "te1", title: "Math Mid-Term", status: "PUBLISHED", duration: 60, questions: [{ id: "q1" }], attempts: [{ id: "a1", score: 85 }] },
  ];
}

export function mockTeacherAttendance(classId: string) {
  return [
    { id: "ar1", studentId: "s1", date: iso(now), status: "PRESENT", classId },
    { id: "ar2", studentId: "s2", date: iso(now), status: "LATE", classId },
  ];
}

export function parentDashboard() {
  return {
    parent: {
      children: [
        { studentId: "dev-student-profile", student: { user: { firstName: "Student", lastName: "One" }, class: { name: "Grade 10A" } } },
      ],
    },
    grades: [{ subject: "Mathematics", score: 85, studentId: "dev-student-profile" }],
    attendance: [{ status: "PRESENT", date: iso(now), studentId: "dev-student-profile" }],
    invoices: [{ id: "inv1", status: "PENDING", total: 2500000, paidAmount: 0, invoiceNo: "INV-2025-DEMO", dueDate: iso(now) }],
    notifications: [{ id: "pn1", title: "Fee reminder", body: "Term 2 fees due soon", read: false }],
  };
}

export function mockParentFees() {
  return [
    {
      id: "inv1",
      invoiceNo: "INV-2025-DEMO",
      total: 2500000,
      paidAmount: 0,
      status: "PENDING",
      dueDate: iso(now),
      student: { user: { firstName: "Student", lastName: "One" } },
      payments: [],
    },
    {
      id: "inv2",
      invoiceNo: "INV-2024-PAID",
      total: 1500000,
      paidAmount: 1500000,
      status: "PAID",
      dueDate: iso(now),
      student: { user: { firstName: "Student", lastName: "One" } },
      payments: [{ id: "p1", amount: 1500000, status: "COMPLETED" }],
    },
  ];
}

export function mockParentChildren() {
  return parentDashboard().parent.children;
}

export function mockChildPerformance() {
  return {
    grades: mockGrades(),
    exams: mockExams(),
  };
}

export function mockChildAttendance() {
  return mockAttendance();
}

export function adminDashboard() {
  return {
    students: 15,
    teachers: 5,
    parents: 10,
    classes: 3,
    revenue: 12500000,
    attendance: [
      { status: "PRESENT", _count: 280 },
      { status: "ABSENT", _count: 20 },
      { status: "LATE", _count: 15 },
    ],
  };
}

export function mockAdminStudents() {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `stu-${i + 1}`,
    studentId: `STU202500${i + 1}`,
    user: { firstName: `Student`, lastName: `${i + 1}`, email: `student${i + 1}@marcelino.edu` },
    class: { name: i < 4 ? "Grade 10A" : "Grade 10B" },
  }));
}

export function mockAdminTeachers() {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `tch-${i + 1}`,
    employeeId: `TCH00${i + 1}`,
    user: { firstName: "Teacher", lastName: `${i + 1}`, email: `teacher${i + 1}@marcelino.edu` },
  }));
}

export function mockAdminClasses() {
  return [
    { id: "c1", name: "Grade 10A", sections: [{ name: "A" }, { name: "B" }], students: [{ id: "s1" }, { id: "s2" }] },
    { id: "c2", name: "Grade 10B", sections: [{ name: "A" }], students: [{ id: "s3" }] },
    { id: "c3", name: "Grade 9A", sections: [{ name: "A" }], students: [] },
  ];
}

export function mockAdminFinance() {
  return {
    payments: [
      { provider: "FLUTTERWAVE", _sum: { amount: 8000000 }, _count: 45 },
      { provider: "MTN_MOMO", _sum: { amount: 3500000 }, _count: 120 },
    ],
    overdue: 3,
  };
}

export function mockAdminPayroll() {
  return [
    { id: "pr1", name: "March 2025", period: "2025-03", entries: [{ id: "e1", amount: 2500000 }] },
    { id: "pr2", name: "February 2025", period: "2025-02", entries: [{ id: "e2", amount: 2500000 }] },
  ];
}

export function mockAnalyticsInsights() {
  return {
    insights: [
      { type: "info", title: "Enrollment", value: 15, description: "15 active students enrolled" },
      { type: "success", title: "Revenue", value: 12500000, description: "48 completed payments" },
      { type: "success", title: "Average Performance", value: "78.5%", description: "School-wide grade average" },
      { type: "success", title: "Attendance Rate", value: "93.3%", description: "Overall attendance this period" },
      { type: "warning", title: "Overdue Fees", value: 3, description: "Invoices requiring follow-up" },
    ],
    summary: { students: 15, teachers: 5, avgGrade: 78.5, attendanceRate: 93.3, revenue: 12500000 },
  };
}

export function mockLibraryBooks() {
  return [
    { id: "b1", title: "Advanced Mathematics", author: "Dr. Okello", isbn: "978-001", available: 12 },
    { id: "b2", title: "Physics Fundamentals", author: "Prof. Namukasa", isbn: "978-002", available: 8 },
  ];
}

export function mockHostels() {
  return [
    { id: "h1", name: "Boys Hostel A", capacity: 120, occupied: 98 },
    { id: "h2", name: "Girls Hostel B", capacity: 100, occupied: 87 },
  ];
}

export function mockTransportRoutes() {
  return [
    { id: "r1", name: "Kampala Central", vehicle: "Bus 01", stops: 8 },
    { id: "r2", name: "Entebbe Road", vehicle: "Bus 02", stops: 5 },
  ];
}

export function mockInventoryItems() {
  return [
    { id: "i1", name: "Science Lab Kits", quantity: 45, minStock: 20, category: "LAB" },
    { id: "i2", name: "Chalk Boxes", quantity: 8, minStock: 15, category: "SUPPLIES" },
  ];
}

export function mockAdminSettings() {
  return [
    { key: "school.name", value: "Marcelino International School" },
    { key: "school.currency", value: "UGX" },
    { key: "payments.flutterwave", value: "enabled" },
  ];
}

/** @deprecated Use fees checkout route with dev-fees-store */
export function mockFeeCheckout(invoiceId: string, provider: string) {
  const reference = `MOCK-${Date.now()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    reference,
    checkoutUrl: `${appUrl}/portal/parent/fees/callback?ref=${reference}&invoiceId=${invoiceId}&provider=${provider}&mock=true`,
    metadata: { mock: true },
  };
}
