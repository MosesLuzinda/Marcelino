export const DEV_MOCK_ENABLED = process.env.DEV_MOCK_AUTH === "true";

export interface DevUser {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export const DEV_USERS: DevUser[] = [
  {
    userId: "dev-admin",
    email: "admin@marcelino.edu",
    password: "Admin@123456",
    firstName: "System",
    lastName: "Administrator",
    roles: ["SUPER_ADMIN"],
    permissions: ["*"],
  },
  {
    userId: "dev-teacher-1",
    email: "teacher1@marcelino.edu",
    password: "Password@123",
    firstName: "Teacher",
    lastName: "One",
    roles: ["TEACHER"],
    permissions: [
      "attendance:read", "attendance:write", "grades:read", "grades:write",
      "assignments:read", "assignments:write", "exams:read", "exams:write",
      "students:read", "courses:read",
    ],
  },
  {
    userId: "dev-student-1",
    email: "student1@marcelino.edu",
    password: "Password@123",
    firstName: "Student",
    lastName: "One",
    roles: ["STUDENT"],
    permissions: ["attendance:read", "grades:read", "assignments:read", "exams:read", "courses:read"],
  },
  {
    userId: "dev-parent-1",
    email: "parent1@marcelino.edu",
    password: "Password@123",
    firstName: "Parent",
    lastName: "One",
    roles: ["PARENT"],
    permissions: ["students:read", "attendance:read", "grades:read", "fees:read", "payments:read", "payments:write"],
  },
];

export function devLogin(email: string, password: string) {
  const user = DEV_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) return null;
  return {
    userId: user.userId,
    email: user.email,
    roles: user.roles,
    permissions: user.permissions,
  };
}

export async function isDatabaseReachable(): Promise<boolean> {
  try {
    const { prisma } = await import("@marcelino/database");
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
