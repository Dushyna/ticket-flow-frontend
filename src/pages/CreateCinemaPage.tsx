import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCreateCinemaMutation } from '../features/cinema/services/cinemaApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';

const CreateCinemaPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });

    const [createCinema, { isLoading }] = useCreateCinemaMutation();

    const handleSubmit = async (e:  React.SyntheticEvent) => {
        e.preventDefault();

        try {
            await createCinema(formData).unwrap();

            dispatch(showNotification({
                message: `Cinema "${formData.name}" successfully registered!`,
                type: 'success'
            }));

            navigate('/dashboard');
        } catch (err) {
            const errorData = err as { data?: { message?: string } };
            dispatch(showNotification({
                message: errorData.data?.message || 'Failed to create cinema. Please try again.',
                type: 'error'
            }));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-6">
            <div className="max-w-xl w-full p-10 bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl text-white">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        Add New <span className="text-indigo-500">Cinema</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
                        Register a new location for your theater chain
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Cinema Name */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4">
                            Official Name
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Star Cinema Central"
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all text-lg font-bold placeholder:text-slate-700"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4">
                            Physical Address
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="City, Street, Building"
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all text-lg font-bold placeholder:text-slate-700"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-50 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            {isLoading ? 'Processing...' : 'Register Cinema'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCinemaPage;
