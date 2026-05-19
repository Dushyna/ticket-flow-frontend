import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '../../features/auth/services/authApi';
import { type UserResponseDto } from '../../features/auth/types/types';
import { Loader2, UserCog, Search, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../../features/notifications/slice/notificationSlice';

export const AdminUserManagement = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Fetch managed or unassigned users inside the administration scope
    const { data: users, isLoading } = useGetAllUsersQuery();

    // 2. Trigger role alteration mutations
    const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();

    // 3. Filter users array by email locally in real-time execution loop
    const filteredUsers = (users || []).filter(user =>
        user && user.email
            ? user.email.toLowerCase().includes(searchTerm.toLowerCase())
            : false
    );

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            // Explicitly cast string from select element to valid Role enum type match
            await updateUserRole({
                userId,
                role: newRole as 'ROLE_USER' | 'ROLE_CASHIER' | 'ROLE_TENANT_ADMIN' | 'ROLE_SUPER_ADMIN'
            }).unwrap();

            dispatch(showNotification({
                message: t('admin.role_updated_success', 'User role successfully updated!'),
                type: 'success'
            }));
        } catch (err) {
            console.error("Failed to execute staff authority modification:", err);

            dispatch(showNotification({
                message: t('admin.role_updated_error', 'Error: You do not have permission to modify roles or network timeout occurred.'),
                type: 'error'
            }));
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin mb-2 text-indigo-500" size={32} />
                <p className="uppercase tracking-widest text-xs font-black text-slate-400">
                    {t('admin.loading')}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-10 flex flex-col items-center">
            <div className="w-full max-w-5xl">

                {/* HEADER SECTION WITH FILTER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <UserCog size={24} className="text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                                {t('admin.title')}
                            </h1>
                            <ShieldCheck size={20} className="text-emerald-500 mt-1 animate-pulse" />
                        </div>
                    </div>

                    {/* SEARCH FILTER BAR */}
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-4 top-3.5 text-slate-600" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('admin.search_placeholder')}
                            className="w-full bg-white/5 border border-white/10 pl-11 pr-5 py-3.5 rounded-2xl text-white font-bold placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                        />
                    </div>
                </div>

                {/* USER DIRECTORY TABLE */}
                <div className="w-full bg-white/5 border border-white/10 rounded-[30px] overflow-hidden backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                            <th className="p-6">{t('admin.th_email')}</th>
                            <th className="p-6">{t('admin.th_id')}</th>
                            <th className="p-6 text-center">{t('admin.th_status')}</th>
                            <th className="p-6 text-right">{t('admin.th_action')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-bold text-slate-300">
                        {filteredUsers?.map((user: UserResponseDto) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-6 text-white font-black italic">{user.email}</td>
                                <td className="p-6 text-xs font-mono text-slate-500">{user.id}</td>
                                <td className="p-6 text-center">
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                        user.role === 'ROLE_USER' ? 'bg-slate-500/10 text-slate-400' :
                                            user.role === 'ROLE_CASHIER' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'
                                    }`}>
                                        {user.role === 'ROLE_USER' && t('admin.role_option_user')}
                                        {user.role === 'ROLE_CASHIER' && t('admin.role_option_cashier')}
                                        {user.role === 'ROLE_TENANT_ADMIN' && t('admin.role_option_tenant')}
                                        {user.role === 'ROLE_SUPER_ADMIN' && "SUPER ADMIN"}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <select
                                        value={user.role}
                                        disabled={isUpdating}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="bg-slate-900 border border-white/10 p-2.5 rounded-xl text-xs font-black uppercase text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer disabled:opacity-30"
                                    >
                                        <option value="ROLE_USER">{t('admin.role_option_user')}</option>
                                        <option value="ROLE_CASHIER">{t('admin.role_option_cashier')}</option>
                                        <option value="ROLE_TENANT_ADMIN">{t('admin.role_option_tenant')}</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* FALLBACK STATE FOR EMPTY DIRECTORY SEARCH RESULT */}
                    {filteredUsers?.length === 0 && (
                        <div className="text-center p-20 border-t border-white/5 bg-white/[0.01]">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                {t('admin.no_results')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
