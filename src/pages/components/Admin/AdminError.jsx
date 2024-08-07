import React from 'react';

const AdminError = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-900">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-xl text-neutral-100">You need to be an admin to view this page.</p>
            <p className="text-xl text-neutral-100">Please contact the web team if this is an error.</p>
        </div>
    );
};

export default AdminError;
