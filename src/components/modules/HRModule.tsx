import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, Clock, Calendar, FileText, DollarSign } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const HRModule: React.FC = () => {
  const { employees, addEmployee, markAttendance, formatCurrency } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Sales Representative');
  const [department, setDepartment] = useState('Sales');
  const [monthlySalary, setMonthlySalary] = useState(3500);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addEmployee({
      employeeCode: `EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      name,
      designation,
      department,
      joiningDate: new Date().toISOString().split('T')[0],
      phone: '+1 555-0188',
      email: `${name.toLowerCase().replace(/\s+/g, '')}@company.com`,
      monthlySalary,
      status: 'Active'
    });

    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Human Resources & Payroll
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Employee Directory, Daily Attendance, Monthly Salary Payroll & Payslips
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Staff Roster */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3 px-4">Emp Code</th>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Department / Designation</th>
                <th className="py-3 px-4 text-right">Monthly Salary</th>
                <th className="py-3 px-4 text-center">Attendance Quick Mark</th>
                <th className="py-3 px-4 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{emp.employeeCode}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                  <td className="py-3 px-4 text-slate-500">{emp.department} • {emp.designation}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                    {formatCurrency(emp.monthlySalary)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => markAttendance(emp.id, 'Present')}
                        className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(emp.id, 'Absent')}
                        className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 text-[10px] font-bold"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => alert(`Payslip generated for ${emp.name} for current period.`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]"
                    >
                      Generate Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Employee</h3>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Monthly Salary ($)</label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={e => setMonthlySalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
