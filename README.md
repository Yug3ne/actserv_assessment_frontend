## Creative Dynamic Onboarding Form System — Frontend

This is the React (Vite + TypeScript) frontend for a flexible onboarding platform used by a financial services firm to collect KYC/loan/investment forms, accept document uploads, and support evolving schemas over time. It pairs with a DRF backend (async notifications handled server-side).

### Tech stack

- **React**, 
- **React Router** for routing
- **@tanstack/react-query** for data fetching/caching
- **Zustand** for auth/session state (persisted to `localStorage`)
- **Tailwind CSS** for styling
- **Axios** for HTTP client
- **React-Toastify** for lightweight user feedback

### Quick start

1. Ensure the backend is running and exposes the API base URL.
2. Set the frontend environment variable (see below).
3. Install and run:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` (default Vite port) in your browser.

### Environment variables

**VITE_API_ENDPOINT**: Base URL for the backend API (e.g., `http://localhost:8000/`).

Configure by creating `.env` (or `.env.local`) at the project root:

```bash
VITE_API_ENDPOINT=http://localhost:8000/
```

### Available scripts

- `pnpm dev`: start the Vite dev server
- `pnpm build`: type-check and build for production
- `pnpm preview`: preview the production build
- `pnpm lint`: run eslint

### Project structure (selected)

```
src/
  api/
    api-client.ts          # Axios instance (uses VITE_API_ENDPOINT)
  components/
    form-table.tsx         # Admin view of created forms
  layouts/
    admin-layout.tsx       # Admin shell
    client-layout.tsx      # Client shell
  lib/
    authStore.ts           # Zustand store (persisted auth user/role)
  pages/
    admin/
      dashboard.tsx
      form.tsx             # Admin form builder (UI + JSON hybrid)
      submissions.tsx      # Submissions browser with file links
      client.tsx
    client/
      forms-list.tsx       # Client view of available forms
      forms-fill.tsx       # Client dynamic renderer + multi-step UX
      my-submissions.tsx   # (present but not currently routed)
    login.tsx              # Email/password login, sets persisted user
  App.tsx                  # Routes + guards + toasts
  main.tsx                 # Router + React Query provider bootstrap
```

### Routing and access control

Routes are defined in `src/App.tsx` with role-based guards:

- Public: `/login`
- Admin-only (`allowedRoles=["admin"]`):
  - `/admin/forms`
  - `/admin/submissions`
- Client-only (`allowedRoles=["client"]`):
  - `/` (forms list)
  - `/forms/:id` (dynamic form fill)

Auth state is persisted via `Zustand` (`auth-user` in `localStorage`). After successful login (`POST api/auth/login/`), the app fetches `GET api/user/` and stores the user with a `role` of either `admin` or `client`.

### API usage (as implemented)

The frontend calls these endpoints (prefixes relative to `VITE_API_ENDPOINT`):

- `POST api/auth/login/` → authenticate by email/password
- `GET  api/user/` → current authenticated user
- `GET  api/forms/` → list available forms (client view)
- `GET  api/forms/:id/` → read a single form schema
- `POST api/forms/create/` → create a new form (admin)
- `POST api/forms/submit/` → submit a form with files (multipart)
- `GET  api/submissions/` → list submissions (admin)

`src/api/api-client.ts` configures Axios with `baseURL` and `withCredentials` for cookie-based sessions.

### Admin UX and field configuration strategy (design justification)

- The admin form builder (`/admin/forms`) is a **UI + JSON hybrid**:
  - A simple visual builder to add fields quickly: label, name, type, required, and select choices.
  - An **editable JSON preview** pane shows the full form payload. Admins can make direct edits for advanced configurations or bulk operations.

Why hybrid over only-UI or only-JSON?

- **Learnability**: Non-technical users can configure most needs via UI controls.
- **Power & future-proofing**: The live JSON pane lets power users evolve schema details before the UI catches up (new field types, metadata, versioning).
- **Auditability**: JSON is the single source of truth sent to the backend, making diffs, reviews, and migrations easier.

Current field types supported in the UI: `text`, `number`, `textarea`, `select`, `file` (extendable). The payload contains `schema_version` to enable safe evolution on the backend.

Example create payload sent by the builder:

```json
{
  "name": "Loan Application",
  "description": "KYC and loan intake",
  "fields": [
    {
      "name": "full_name",
      "label": "Full Name",
      "type": "text",
      "required": true
    },
    {
      "name": "loan_amount",
      "label": "Loan Amount",
      "type": "number",
      "required": true
    },
    {
      "name": "income_proof",
      "label": "Income Proof",
      "type": "file",
      "required": false
    },
    {
      "name": "purpose",
      "label": "Purpose",
      "type": "textarea",
      "required": true
    },
    {
      "name": "product",
      "label": "Product",
      "type": "select",
      "choices": ["KYC", "SME", "Mortgage"],
      "required": true
    }
  ],
  "schema_version": 1
}
```

### Client UX and submission flow

- Clients land on `/` (forms list) and navigate to `/forms/:id`.
- `forms-fill.tsx` renders inputs dynamically based on the form schema (`fields`).
- If a form has more than 7 fields, the UI automatically becomes **multi-step** with step indicator and Next/Back controls.
- File uploads: multiple files supported via a single `<input type="file" multiple>` (appended as `files` array in `FormData`).
- Optional fields don’t block submission. Required fields are enforced by input attributes.

Submission payload (multipart) from the client:

```http
POST api/forms/submit/
Content-Type: multipart/form-data

form: <form_id>
data: {"full_name":"…","loan_amount":1000,"product":"SME", …}
files: <0..n files>
```

### Validation and evolving rules

- UI enforces basic `required` constraints per field.
- Complex conditional validation (e.g., income proof only if loan_amount > X) is expected to be validated on the backend. The hybrid JSON strategy allows adding rule metadata in future schema versions without breaking older submissions.

### Notifications and async tasks

- Admin notifications on submission are triggered asynchronously server-side (e.g., Celery). The frontend is decoupled: it submits data and shows success toasts; delivery channels (email, Slack, etc.) are configured on the backend.


### Accessibility & UX notes

- Labels are associated with inputs; required fields are visibly marked with `*`.
- Toasters provide immediate feedback on create/submit exceptions.
- Large forms auto-chunk into pages to reduce cognitive load.

