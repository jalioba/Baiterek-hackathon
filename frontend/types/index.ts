export type Role = "USER" | "AUTHOR" | "ADMIN";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "DOCS_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type DocumentStatus = "PENDING" | "UPLOADED" | "SIGNED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  iin?: string;
  bin?: string;
  companyName?: string;
  companyType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subsidiary {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  targetAudience: string[];
  conditions: string;
  requiredDocs: string[];
  processingDays: number;
  result: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  subsidiaryId: string;
  subsidiary: Subsidiary;
  formSchema?: FormSchema;
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "number"
    | "email"
    | "phone"
    | "date"
    | "select"
    | "checkbox"
    | "textarea"
    | "file";
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormSchema {
  fields: FormField[];
  version: number;
}

export interface Application {
  id: string;
  number: string;
  status: ApplicationStatus;
  userId: string;
  user?: User;
  serviceId: string;
  service: Service;
  formData: Record<string, unknown>;
  documents?: Document[];
  statusHistory?: StatusHistory[];
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  comment?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  userId: string;
  applicationId?: string;
  signedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  applicationId?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category: string;
  isPublished: boolean;
  subsidiaryId?: string;
  subsidiary?: Subsidiary;
  publishedAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminAnalytics {
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalUsers: number;
  newUsersThisMonth: number;
  totalServices: number;
  activeServices: number;
  monthlyApplications: { month: string; count: number }[];
  applicationsByStatus: { status: string; count: number; color: string }[];
  applicationsByCategory: { category: string; count: number }[];
  topServices: { title: string; count: number; subsidiary: string }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}
