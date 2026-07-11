import { get, set, update, del } from 'idb-keyval';
import { CreateExpenseInput, createExpense } from '@/app/actions/expenses';

const EXPENSE_QUEUE_KEY = 'pending-expenses';

export type QueuedExpense = CreateExpenseInput & {
  offlineId: string;
  queuedAt: number;
  syncStatus: 'pending' | 'syncing' | 'failed';
};

// Add an expense to the local IndexedDB queue
export async function queueExpenseForSync(expense: Omit<CreateExpenseInput, 'offlineId'>): Promise<QueuedExpense> {
  const offlineId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const queuedExpense: QueuedExpense = {
    ...expense,
    offlineId,
    queuedAt: Date.now(),
    syncStatus: 'pending'
  };

  await update(EXPENSE_QUEUE_KEY, (val) => {
    const queue = (val as QueuedExpense[]) || [];
    return [...queue, queuedExpense];
  });

  return queuedExpense;
}

// Get all pending expenses
export async function getQueuedExpenses(): Promise<QueuedExpense[]> {
  const queue = await get<QueuedExpense[]>(EXPENSE_QUEUE_KEY);
  return queue || [];
}

// Remove an expense from the queue (usually after successful sync)
export async function removeExpenseFromQueue(offlineId: string) {
  await update(EXPENSE_QUEUE_KEY, (val) => {
    const queue = (val as QueuedExpense[]) || [];
    return queue.filter(e => e.offlineId !== offlineId);
  });
}

// Trigger background sync for all pending expenses
export async function syncOfflineExpenses(): Promise<{ success: number; failed: number }> {
  const queue = await getQueuedExpenses();
  if (queue.length === 0) return { success: 0, failed: 0 };

  let successCount = 0;
  let failCount = 0;

  for (const item of queue) {
    if (item.syncStatus === 'syncing') continue; // Prevent double submission

    try {
      // Mark as syncing
      await update(EXPENSE_QUEUE_KEY, (val) => {
        const q = (val as QueuedExpense[]) || [];
        return q.map(e => e.offlineId === item.offlineId ? { ...e, syncStatus: 'syncing' } : e);
      });

      // Attempt to save to database
      const res = await createExpense({
        projectId: item.projectId,
        amount: item.amount,
        category: item.category,
        date: item.date,
        notes: item.notes,
        receiptUrl: item.receiptUrl,
        offlineId: item.offlineId
      });

      if (res.success) {
        // Remove from queue on success
        await removeExpenseFromQueue(item.offlineId);
        successCount++;
      } else {
        // Revert to pending if server rejected it
        await update(EXPENSE_QUEUE_KEY, (val) => {
          const q = (val as QueuedExpense[]) || [];
          return q.map(e => e.offlineId === item.offlineId ? { ...e, syncStatus: 'failed' } : e);
        });
        failCount++;
      }
    } catch (e) {
      console.error("Sync failed for item", item.offlineId, e);
      await update(EXPENSE_QUEUE_KEY, (val) => {
        const q = (val as QueuedExpense[]) || [];
        return q.map(e => e.offlineId === item.offlineId ? { ...e, syncStatus: 'failed' } : e);
      });
      failCount++;
    }
  }

  return { success: successCount, failed: failCount };
}
