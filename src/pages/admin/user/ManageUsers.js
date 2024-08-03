import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {apiGetAllUsers} from 'apis';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async (params) => {
        const response = await apiGetAllUsers(params);
        if (response?.results?.statusCode === 200) {
            const {users} = response?.results;
            setUsers(users);
        }
    };

    useEffect(() => {
        fetchUsers().then();
    }, []);

    const handleEdit = (userId) => {
        // Implement the edit functionality here
        console.log('Edit user with ID:', userId);
    };

    const handleDelete = (userId) => {
        // Implement the delete functionality here
        console.log('Delete user with ID:', userId);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created
                            At
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated
                            At
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${user.firstName} ${user.lastName}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.hasVerifiedEmail ? 'Yes' : 'No'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roles.map(role => role.name).join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(user.createdAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(user.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    onClick={() => handleEdit(user.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
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
