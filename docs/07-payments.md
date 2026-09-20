# 07 — Payments (Tuition)

The **Payments** page (`pages/payments`) shows the student's tuition status and history. Data comes from the profile payload (`GET /api/students/me`).

## Data model

```ts
type PaymentStatus = 'paid' | 'unpaid' | 'late';

interface Payment {
  _id: string;
  studentId: string;
  month: string;          // e.g. "September"
  amount: number;         // in EGP
  status: PaymentStatus;
  paidOn?: string;        // date when payment was confirmed
  markedBy: string;       // who (teacher) marked it
}

// Profile also carries:
//   currentMonth: string        -> "September"
//   currentPayment: Payment | null  -> current-month record
```

## Current-month status banner

Three states:

1. **`currentPayment.status === 'paid'`** → green banner "All set for {month} 🎉", with "{amount} EGP paid on {date}" (or "{amount} EGP paid" when there is no `paidOn`), plus a success "Paid" tag.
2. **`currentPayment.status === 'unpaid'` or `'late'`** → amber (unpaid) / red (late) banner:
   - "Payment {status} for {month}"
   - "{amount} EGP — pay in cash to your teacher to get marked as paid."
   - A warn/danger status tag.
3. **No `currentPayment`** → neutral banner: "No payment record for {month}" + "Ask your teacher if you have any questions."

## Severity mapping

```ts
'paid'   → success
'late'   → danger
'unpaid' → warn
```

## History table

- Header: Month | Amount | Status | Paid on.
- Each row: bold month, `{amount}` + localized currency (`EGP` / `ج.م`), colored status tag via `i18n.payStatus(status)`, and the paid date (long date, localized) or `—`.
- Rows come from `profile.payments[]` (no pagination client-side).
- Empty state: "No payment history yet."

## Where payments also appear

- **Dashboard banner**: if the current payment is not `paid`, the dashboard shows a payment banner with the status tag ("Payment {status} for {month}", "{amount} EGP due") and a "Details" button that links to `/payments`. A late payment renders with a red warning icon; unpaid uses an amber info icon.

Payments are **read-only** for students — marking them paid/unpaid is done by the teacher backend-side (`markedBy`).