export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/public/v1`;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type Endpoint = {
  method: HttpMethod;
  path: string;
  description: string;
  response: string;
};

export type EndpointGroup = {
  category: string;
  endpoints: Endpoint[];
};

export const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "badge-success",
  POST: "badge-info",
  PUT: "badge-warning",
  DELETE: "badge-error",
};

export const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    category: "Profile",
    endpoints: [
      {
        method: "GET",
        path: "/profile",
        description: "Returns the public profile information of the portfolio owner.",
        response: `{
  "message": "profile retrieved successfully",
  "data": {
    "id": 12,
    "userId": 7,
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "title": "Full Stack Engineer",
    "birthday": "1998-03-14T00:00:00Z",
    "bio": "Passionate about building scalable web applications and clean user experiences.",
    "phone": "+63 917 555 1023",
    "website": "https://juandelacruz.dev",
    "location": "Cebu City, Philippines",
    "profileImage": "https://cdn.example.com/profile/avatar.webp",
    "createdAt": "2026-01-08T09:12:44Z",
    "updatedAt": "2026-05-18T11:45:21Z"
  }
}`,
      },
    ],
  },
  {
    category: "Skills",
    endpoints: [
      {
        method: "GET",
        path: "/skill",
        description: "Returns all technical skills with proficiency levels.",
        response: `{
  "message": "skills retrieved successfully",
  "skills": [
    {
      "id": 1,
      "userId": 7,
      "skillName": "TypeScript",
      "proficiency": "Advanced",
      "createdAt": "2026-02-10T07:21:15Z",
      "updatedAt": "2026-04-01T10:18:42Z"
    },
    {
      "id": 2,
      "userId": 7,
      "skillName": "Go",
      "proficiency": "Intermediate",
      "createdAt": "2026-02-10T07:22:10Z",
      "updatedAt": "2026-04-01T10:19:01Z"
    },
    {
      "id": 3,
      "userId": 7,
      "skillName": "PostgreSQL",
      "proficiency": "Advanced",
      "createdAt": "2026-02-10T07:23:54Z",
      "updatedAt": "2026-04-01T10:19:26Z"
    }
  ]
}`,
      },
    ],
  },
  {
    category: "Education",
    endpoints: [
      {
        method: "GET",
        path: "/education",
        description: "Returns the academic background and educational history.",
        response: `{
  "message": "education retrieved successfully",
  "educations": [
    {
      "id": 4,
      "userId": 7,
      "school": "University of San Carlos",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2016-06-01T00:00:00Z",
      "endDate": "2020-04-15T00:00:00Z",
      "createdAt": "2026-01-12T08:44:11Z",
      "updatedAt": "2026-03-20T09:33:02Z"
    }
  ]
}`,
      },
    ],
  },
  {
    category: "Projects",
    endpoints: [
      {
        method: "GET",
        path: "/project",
        description: "Returns all published and featured portfolio projects.",
        response: `{
  "message": "projects retrieved successfully",
  "projects": [
    {
      "id": 21,
      "userId": 7,
      "title": "TaskFlow",
      "description": "A collaborative productivity platform for remote engineering teams.",
      "link": "https://taskflow.app",
      "githubLink": "https://github.com/example/taskflow",
      "status": "completed",
      "isDraft": false,
      "createdAt": "2026-02-01T05:12:18Z",
      "updatedAt": "2026-05-02T10:41:55Z",
      "images": {
        "cover": "https://cdn.example.com/projects/taskflow/cover.webp",
        "screenshots": [
          "https://cdn.example.com/projects/taskflow/screen-1.webp",
          "https://cdn.example.com/projects/taskflow/screen-2.webp"
        ]
      },
      "technologies": [
        { "id": 1, "name": "Next.js", "slug": "nextjs", "category": "frontend" },
        { "id": 2, "name": "Tailwind CSS", "slug": "tailwindcss", "category": "frontend" },
        { "id": 3, "name": "PostgreSQL", "slug": "postgresql", "category": "backend" }
      ]
    }
  ]
}`,
      },
      {
        method: "GET",
        path: "/project/:id",
        description: "Returns a single project by its unique identifier.",
        response: `{
  "message": "project retrieved successfully",
  "project": {
    "id": 21,
    "userId": 7,
    "title": "TaskFlow",
    "description": "A collaborative productivity platform for remote engineering teams.",
    "link": "https://taskflow.app",
    "githubLink": "https://github.com/example/taskflow",
    "status": "completed",
    "isDraft": false,
    "createdAt": "2026-02-01T05:12:18Z",
    "updatedAt": "2026-05-02T10:41:55Z"
  }
}`,
      },
    ],
  },
  {
    category: "Experience",
    endpoints: [
      {
        method: "GET",
        path: "/experience",
        description: "Returns professional work experiences and roles.",
        response: `{
  "message": "experiences retrieved successfully",
  "experiences": [
    {
      "id": 1,
      "userId": 7,
      "title": "Frontend Engineer",
      "company": "CloudCore Solutions",
      "startDate": "2022-01-10T00:00:00Z",
      "endDate": "2024-06-30T00:00:00Z",
      "description": "Developed scalable internal tools and optimized frontend performance across multiple client platforms.",
      "createdAt": "2026-03-01T09:10:11Z",
      "updatedAt": "2026-05-14T07:55:42Z"
    }
  ]
}`,
      },
    ],
  },
  {
    category: "Certificates",
    endpoints: [
      {
        method: "GET",
        path: "/certificate",
        description: "Returns earned certifications and credentials.",
        response: `{
  "message": "certificates retrieved successfully",
  "certificates": [
    {
      "id": 1,
      "userId": 7,
      "title": "AWS Certified Developer – Associate",
      "issuer": "Amazon Web Services",
      "issueDate": "2025-09-18T00:00:00Z",
      "expirationDate": "2028-09-18T00:00:00Z",
      "credentialId": "AWS-DEV-938221",
      "credentialUrl": "https://verify.aws.example/certificate/938221",
      "createdAt": "2026-04-04T10:11:29Z",
      "updatedAt": "2026-04-04T10:11:29Z"
    }
  ]
}`,
      },
    ],
  },
];
