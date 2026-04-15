import { useState } from 'react';
import { Ticket, Plus, Trash2, Percent, CheckCircle2 } from 'lucide-react';
import {
    useGetMyTicketTypesQuery,
    useCreateTicketTypeMutation,
    useDeleteTicketTypeMutation
} from '../../features/cinema/services/movieApi';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../features/notifications/slice/notificationSlice';
import ConfirmModal from '../../components/ConfirmModal';
import { useFormik } from "formik";
import * as Yup from "yup";

const TicketTypesPage = () => {
    const dispatch = useDispatch();
    const { data: ticketTypes, isLoading } = useGetMyTicketTypesQuery();
    const [createTicketType, { isLoading: isCreating }] = useCreateTicketTypeMutation();
    const [deleteTicketType, { isLoading: isDeleting }] = useDeleteTicketTypeMutation();

    const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            newLabel: "",
            newDiscount: 1,
            isDefault: false,
        },
        validationSchema: Yup.object({
            newLabel: Yup.string()
                .trim()
                .required("Category name is required"),

            newDiscount: Yup.number()
                .typeError("Must be a number")
                .min(0, "Min 0")
                .max(5, "Max 5")
                .required("Required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            await createTicketType({
                label: values.newLabel,
                discount: values.newDiscount,
                isDefault: values.isDefault,
            }).unwrap();

            dispatch(showNotification({
                message: "Ticket type added!",
                type: "success"
            }));

            resetForm();
        }
    });


    return (
        <div className="p-10 bg-slate-950 min-h-screen text-white flex flex-col items-center">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 text-indigo-400">
                        <Ticket size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                            Ticket <span className="text-indigo-500">Pricing</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
                            Manage discounts and ticket categories
                        </p>
                    </div>
                </div>

                {/* Form to add new type */}
                <form onSubmit={formik.handleSubmit} className="bg-white/5 p-10 rounded-[40px] border border-white/10 mb-12 backdrop-blur-xl">
                    <div className="flex gap-6 items-center mb-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Category Name</label>
                            <input
                                name="newLabel"
                                value={formik.values.newLabel}
                                onChange={formik.handleChange}
                                placeholder="Enter the name of the ticket type"
                                onBlur={formik.handleBlur}
                                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all text-white"

                            />

                            {formik.touched.newLabel && formik.errors.newLabel && (
                                <div className="text-red-500 text-[10px]">
                                    {formik.errors.newLabel}
                                </div>
                            )}
                            <div className="text-[10px] text-slate-500 mt-2 ml-2">
                                e.g. Adult, Student, Child, VIP
                            </div>
                        </div>

                        <div className="w-40 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Price Multiplier</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="newDiscount"
                                    value={formik.values.newDiscount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm font-black text-indigo-400 outline-none"
                                />
                                {formik.touched.newDiscount && formik.errors.newDiscount && (
                                    <div className="text-red-500 text-[10px]">
                                        {formik.errors.newDiscount}
                                    </div>
                                )}

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase">x Price</div>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-2 ml-2">
                                e.g. 1 = normal, 0.8 ↓, 1.2 ↑
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating || !formik.isValid}
                            className="bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl transition-all disabled:opacity-20 shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                onClick={() =>
                                    formik.setFieldValue("isDefault", !formik.values.isDefault)
                                }
                                className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                                    formik.values.isDefault ? 'bg-indigo-600 border-indigo-600' : 'border-white/10 bg-white/5 group-hover:border-white/20'
                                }`}
                            >
                                {formik.values.isDefault && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Set as default for all bookings</span>
                        </label>

                        <div className="text-[10px] font-bold text-slate-500 italic">
                            {formik.values.newDiscount < 1 ? (
                                <span className="text-emerald-500">⬇ {Math.round((1 - formik.values.newDiscount) * 100)}% Discount</span>
                            ) : formik.values.newDiscount > 1 ? (
                                <span className="text-amber-500">⬆ {Math.round((formik.values.newDiscount - 1) * 100)}% Markup</span>
                            ) : (
                                <span>Standard Price (No Change)</span>
                            )}
                        </div>
                    </div>
                </form>

                {/* List of existing types */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="animate-pulse text-slate-500 uppercase font-black text-center py-10">Loading types...</div>
                    ) : (
                        ticketTypes?.map((type) => (
                            <div key={type.id} className="group bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center justify-between hover:bg-white/[0.07] transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-indigo-400">
                                        <Percent size={20} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-white text-lg uppercase italic tracking-tight">{type.label}</h3>
                                            {type.isDefault && (
                                                <span className="flex items-center gap-1 text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-emerald-500/20">
                                                    <CheckCircle2 size={8} /> Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-indigo-400 font-bold text-xs uppercase tracking-tighter">
                                            Multiplier: {type.discount.toFixed(2)}x
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setTypeToDelete(type.id)}
                                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal */}
            {typeToDelete && (
                <ConfirmModal
                    title="Delete Ticket Type"
                    message="Are you sure? This might affect existing price calculations."
                    onConfirm={async () => {
                        await deleteTicketType(typeToDelete).unwrap();
                        setTypeToDelete(null);
                        dispatch(showNotification({ message: "Deleted", type: "success" }));
                    }}
                    onCancel={() => setTypeToDelete(null)}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};

export default TicketTypesPage;
