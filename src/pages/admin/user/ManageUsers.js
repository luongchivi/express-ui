import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {apiGetAllUsers, apiUpdateStatusAdmin} from 'apis';
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingUserStatus, setEditingUserStatus] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await apiGetAllUsers();
            if (response?.results?.statusCode === 200) {
                const { users } = response?.results;
                setUsers(users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const userStatusColors = {
        'false': 'bg-red-100 text-red-800',
        'true': 'bg-green-100 text-green-800',
    };

    const userStatus = {
        TRUE: 'true',
        FALSE: 'false',
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (userId, isActive) => {
        setEditingUserId(userId);
        setEditingUserStatus(isActive ? 'true' : 'false');
    };

    const handleSave = async (userId) => {
        try {
            const response = await apiUpdateStatusAdmin(userId, { isActive: editingUserStatus === 'true' });
            if (response?.results?.statusCode === 200) {
                setEditingUserId(null);
                await Swal.fire('Successfully', response?.results?.message, 'success');
                fetchUsers();
            } else {
                await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
            }

        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
            <div className="overflow-x-auto border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated At</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${user.firstName} ${user.lastName}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.hasVerifiedEmail ? 'Yes' : 'No'}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${userStatusColors[user.isActive.toString()]}`}>
                                {editingUserId === user.id ? (
                                    <select
                                        value={editingUserStatus}
                                        onChange={(e) => setEditingUserStatus(e.target.value)}
                                        className="p-2 bg-white border border-gray-300 rounded"
                                    >
                                        {Object.values(userStatus).map(status => (
                                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                        ))}
                                    </select>
                                ) : (
                                    user.isActive ? 'Active' : 'Inactive'
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roles.map(role => role.name).join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(user.createdAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(user.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editingUserId === user.id ? (
                                    <>
                                        <button
                                            className="text-green-600 hover:text-green-900 mr-4"
                                            onClick={() => handleSave(user.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => setEditingUserId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => handleEdit(user.id, user.isActive)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
