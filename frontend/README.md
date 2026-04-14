# BytesDoc - Document Management System

A modern, role-based document management system built for BYTES Student Council.

## Features

- Role-based access control (Chief Minister, Secretary, Finance Minister, Member)
- Document upload, view, edit, delete, and archive
- Activity logging and audit trails
- User management
- Dark/Light mode
- Responsive design
- Mock data for demonstration

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Zustand (State Management)
- Recharts (Charts)
- Lucide React (Icons)
- next-themes (Dark Mode)

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Demo Credentials

Use these credentials to test different roles:

- Chief Minister: `admin@bytes.com`
- Secretary: `secretary@bytes.com`
- Finance Minister: `finance@bytes.com`
- Member: `member@bytes.com`

Password: Any password (mock authentication)

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Role-based dashboards
│   │   ├── chief_minister/  # Admin panel
│   │   ├── secretary/       # Secretary panel
│   │   ├── finance_minister/# Finance panel
│   │   └── member/          # Member panel
│   ├── login/               # Login page
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── charts/              # Chart components
│   ├── layout/              # Layout components
│   └── ui/                  # UI components
├── lib/                     # Utilities and stores
│   ├── mockData.ts          # Mock data
│   └── stores/              # Zustand stores
└── types/                   # TypeScript types
```

## Role Permissions

### Chief Minister (Admin)
- Full access to all features
- Manage users
- Archive documents
- View activity logs
- Upload, edit, delete documents

### Secretary
- Upload proposals, permits, reports
- Edit/delete own documents
- View non-financial documents
- Read-only archive access

### Finance Minister
- View financial documents only
- Upload budgets and financial records
- Read-only archive access

### Member
- View-only access to all documents
- No upload or edit permissions
- Read-only archive access

## License

© 2024 BYTES Student Council
