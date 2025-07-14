import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiDollarSign, FiUser, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ManagePickupPartners = () => {
  const [partners, setPartners] = useState([]);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [transferModal, setTransferModal] = useState({
    show: false,
    partnerId: null,
    partnerName: "",
    amount: ""
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/partners");
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Failed to fetch partners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPartner = async () => {
    if (!newPartnerName.trim()) {
      toast.error("Please enter a partner name");
      return;
    }
    
    try {
      await axiosInstance.post("/api/partners", { name: newPartnerName });
      setNewPartnerName("");
      toast.success("Partner added successfully!");
      fetchPartners();
    } catch (error) {
      console.error("Error adding partner:", error);
      toast.error(error.response?.data?.message || "Failed to add partner");
    }
  };

  const handleDeletePartner = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this partner?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/partners/${id}`);
      toast.success("Partner deleted successfully");
      fetchPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner");
    }
  };

  const handleTransferFunds = async () => {
    if (!transferModal.amount || isNaN(transferModal.amount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await axiosInstance.post(`/api/partners/${transferModal.partnerId}/transfer-funds`, {
        amount: parseFloat(transferModal.amount)
      });
      toast.success(`₹${transferModal.amount} transferred successfully`);
      setTransferModal({ show: false, partnerId: null, partnerName: "", amount: "" });
      fetchPartners();
    } catch (error) {
      console.error("Error transferring funds:", error);
      toast.error(error.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"
        >
          <div className="flex items-center">
            <FiUser className="text-blue-600 mr-3 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Pickup Partners
            </h1>
          </div>
          <button 
            onClick={fetchPartners}
            className="flex items-center text-sm bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </motion.div>

        {/* Add Partner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Partner</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Enter partner name"
              className="flex-1 px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPartner()}
            />
            <button 
              className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${newPartnerName.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              onClick={handleAddPartner}
              disabled={!newPartnerName.trim()}
            >
              <FiPlus className="mr-2" />
              Add Partner
            </button>
          </div>
        </motion.div>

        {/* Partners Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
        >
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <motion.tr 
                        key={partner._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {partner.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {partner.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-900">
                          ₹{partner.walletBalance?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button 
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center hover:bg-blue-100 transition-colors"
                              onClick={() => setTransferModal({
                                show: true,
                                partnerId: partner._id,
                                partnerName: partner.name,
                                amount: ""
                              })}
                            >
                              <FiDollarSign className="mr-1" />
                              Transfer
                            </button>
                            <button 
                              className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm flex items-center hover:bg-red-100 transition-colors"
                              onClick={() => handleDeletePartner(partner._id)}
                            >
                              <FiTrash2 className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {partners.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No partners found. Add your first partner above.
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Transfer Funds Modal */}
      <AnimatePresence>
        {transferModal.show && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="bg-blue-600 p-5">
                <h2 className="text-xl font-bold text-white">
                  <FiDollarSign className="inline mr-2" />
                  Transfer Funds
                </h2>
                <p className="text-blue-100 mt-1">To: {transferModal.partnerName}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={transferModal.amount}
                      onChange={(e) => setTransferModal({...transferModal, amount: e.target.value})}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600 text-sm">Recipient:</span>
                    <span className="font-medium text-gray-900">{transferModal.partnerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-blue-100 mt-2 pt-2">
                    <span className="text-gray-600 text-sm">Amount:</span>
                    <span className="font-bold text-blue-600">
                      ₹{transferModal.amount || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => setTransferModal({ show: false, partnerId: null, partnerName: "", amount: "" })}
                  className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferFunds}
                  disabled={!transferModal.amount || isNaN(transferModal.amount)}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${(!transferModal.amount || isNaN(transferModal.amount)) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Confirm Transfer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePickupPartners;