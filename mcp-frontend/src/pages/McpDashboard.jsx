import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { axiosInstance } from "../lib/axios.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { authUser } = useAuthStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amountToAdd, setAmountToAdd] = useState("");
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [transferAmount, setTransferAmount] = useState("");


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosInstance.get("/api/mcp/dashboard");
                console.log(response.data);
                setDashboardData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);

        return () => clearInterval(interval);
    }, []);



    const handleOpenTransferForm = (partner) => {
        setSelectedPartner(partner);
        setTransferAmount("");
    };

    const handleTransferFunds = async () => {
        if (!transferAmount || parseFloat(transferAmount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (parseFloat(transferAmount) > dashboardData.walletBalance) {
            alert("Insufficient Wallet Balance.");
            return;
        }

        const confirmTransfer = window.confirm(`Transfer ₹${transferAmount} to ${selectedPartner.name}?`);
        if (!confirmTransfer) return;

        try {
            const response = await axiosInstance.post("/api/mcp/transfer-funds", {
                partnerId: selectedPartner._id,  // Assuming partner has _id
                amount: parseFloat(transferAmount),
            });

            // Update Wallet Balance after transfer
            setDashboardData(prev => ({
                ...prev,
                walletBalance: response.data.newWalletBalance,
            }));

            alert(`Successfully transferred ₹${transferAmount} to ${selectedPartner.name}`);
            setSelectedPartner(null);
            setTransferAmount("");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to transfer funds.");
        }
    };




    const handleAddFunds = async () => {
        if (!amountToAdd || parseFloat(amountToAdd) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const confirmAdd = window.confirm(`Are you sure you want to add ₹${amountToAdd}?`);
        if (!confirmAdd) return;

        try {
            const response = await axiosInstance.post("/api/mcp/add-funds", {
                amount: parseFloat(amountToAdd)
            });

            // ✅ Update dashboardData walletBalance directly
            setDashboardData(prev => ({
                ...prev,
                walletBalance: response.data.newWalletBalance,
            }));

            setAmountToAdd("");
            alert(`₹${amountToAdd} added successfully!`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to add funds.");
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error max-w-md mx-auto mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    const orderStatusData = {
        labels: ['Completed', 'Pending'],
        datasets: [
            {
                data: [dashboardData.orders.completed, dashboardData.orders.pending],
                backgroundColor: ['#4ade80', '#fbbf24'],
                hoverBackgroundColor: ['#16a34a', '#d97706']
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, {authUser?.name}</h1>
                    <p className="text-gray-500">Here's your dashboard overview</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                    <button className="btn bg-primary text-white hover:bg-primary-focus">Assign New Order</button>
                    <Link to={"/manage-orders"}><button className="btn bg-secondary text-white hover:bg-secondary-focus">View All Orders</button></Link>
                    <Link to={"/manage-partners"}><button className="btn bg-accent text-white hover:bg-accent-focus">Manage Partners</button>
                    </Link>
                </div>
            </div>

            {/* Wallet Balance */}
            {dashboardData && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <div className="text-gray-600 font-semibold mb-2">Wallet Balance</div>
                    <div className="text-4xl font-bold text-primary">₹{dashboardData?.walletBalance?.toLocaleString()}</div>

                    {/* Add Fund Section */}
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="input input-bordered bg-white text-black  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={amountToAdd}
                            onChange={(e) => setAmountToAdd(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleAddFunds}>
                            Add Fund
                        </button>
                    </div>
                </div>
            )}


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Orders</h2>
                    <p className="text-3xl font-bold text-primary">{dashboardData.orders.total}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-600 mb-2">Completed Orders</h2>
                    <p className="text-3xl font-bold text-green-500">{dashboardData.orders.completed}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-600 mb-2">Pending Orders</h2>
                    <p className="text-3xl font-bold text-yellow-500">{dashboardData.orders.pending}</p>
                </div>
            </div>

            {/* Charts and Pickup Partners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Order Status Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Status</h2>
                    <div className="h-64">
                        <Pie data={orderStatusData} />
                    </div>
                </div>

                {/* Pickup Partners Table */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Pickup Partners</h2>
                        <span className="badge bg-primary text-white">{dashboardData.pickupPartners.length} Total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-gray-600">Name</th>
                                    <th className="text-gray-600">Status</th>
                                    <th className="text-gray-600">Total Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.pickupPartners.map((partner, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-2 text-black">{partner.name}</td>
                                        <td>
                                            <span className={`badge text-white ${partner.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {partner.status}
                                            </span>
                                        </td>
                                        <td className="text-black">{partner.totalOrders || 0}</td>
                                        {/* <td>
                                            
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleOpenTransferForm(partner)}
                                            >
                                                Transfer Funds
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {selectedPartner && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-fade-in">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Transfer Funds
          </h2>
          <button 
            onClick={() => setSelectedPartner(null)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-blue-100 mt-1">Sending to: <span className="font-medium text-white">{selectedPartner.name}</span></p>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Transfer Amount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 font-medium">₹</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              className="input input-lg input-bordered w-full pl-10 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Available: ₹{dashboardData?.walletBalance?.toLocaleString() || '0'}
          </p>
        </div>

        {/* Transfer Summary */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Recipient:</span>
            <span className="font-medium text-gray-800">{selectedPartner.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-blue-100">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-blue-600 text-lg">
              ₹{transferAmount || '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
        <button
          onClick={() => setSelectedPartner(null)}
          className="btn btn-ghost text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleTransferFunds}
          className="btn bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  </div>
)}
            </div>

        </div>
    );
};

export default Dashboard;
