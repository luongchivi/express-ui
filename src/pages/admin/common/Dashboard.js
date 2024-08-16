import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {apiGetNumberProductsSalesOfMonth} from "../../../apis/sale";

// Registering the required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = async () => {
            const response = await apiGetNumberProductsSalesOfMonth();
            if (response?.results?.statusCode === 200) {
                setSalesData(response?.results?.sales);
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    const data = {
        labels: salesData.map(data => data.date),
        datasets: [
            {
                label: 'Number of Items Sold',
                data: salesData.map(data => data.itemsSold),
                fill: false,
                backgroundColor: 'rgba(197,54,54,0.2)',
                borderColor: 'rgb(246,97,97)',
            },
        ],
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            {loading ? (
                <p>Loading sales data...</p>
            ) : (
                <Line data={data} />
            )}
        </div>
    );
};

export default AdminDashboard;
