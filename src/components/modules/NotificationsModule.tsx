import React from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const NotificationsModule: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useERP();

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Low stock reorder alerts, overdue payment notices & tax reminders
          </p>
        </div>

        <button
          onClick={clearAllNotifications}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between ${
              n.read
                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl text-white ${
                n.type === 'warning' ? 'bg-amber-500' :
                n.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
              }`}>
                {n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{n.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-400 block mt-1">{n.timestamp}</span>
              </div>
            </div>

            {!n.read && (
              <button
                onClick={() => markNotificationRead(n.id)}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
