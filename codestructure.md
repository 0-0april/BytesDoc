# BytesDoc - Current Project Structure

## Root Directory
```
bytesdoc/
├── .git/
├── .vscode/
├── frontend/
├── hide/
├── README.md
├── requirements.md
└── codestructure.md
```

## Frontend Structure
```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── finance/
│   │   │   └── page.tsx
│   │   ├── finance_minister/
│   │   │   ├── archive/
│   │   │   └── documents/
│   │   ├── member/
│   │   │   ├── archive/
│   │   │   ├── documents/
│   │   │   └── page.tsx
│   │   └── secretary/
│   │       ├── archive/
│   │       ├── documents/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── charts/
│   │   ├── BarChart.tsx
│   │   └── LineChart.tsx
│   ├── dashboard/
│   │   ├── ActivityLogTable.tsx
│   │   ├── ArchiveList.tsx
│   │   ├── DocumentTable.tsx
│   │   ├── DocumentViewerModal.tsx
│   │   ├── UploadModal.tsx
│   │   └── UserTable.tsx
│   ├── layout/
│   │   └── DashboardLayout.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
│
├── lib/
│   ├── mockData.ts
│   └── stores/
│       ├── activityStore.ts
│       ├── authStore.ts
│       ├── documentStore.ts
│       └── userStore.ts
│
├── types/
│   └── index.ts
│
├── .next/
├── node_modules/
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```
