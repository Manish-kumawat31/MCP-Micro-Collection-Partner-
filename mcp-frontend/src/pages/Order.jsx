import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiUser, FiMapPin, FiPhone, FiDollarSign, FiClock, FiRefreshCw, FiBarChart2, FiPlus, FiX } from 'react-icons/fi';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportRange, setReportRange] = useState('daily');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [autoAssignLoading, setAutoAssignLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    partner: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await axiosInstance.get('/api/partners');
      setPartners(response.data);
    } catch (error) {
      toast.error('Failed to fetch partners');
      console.error('Error fetching partners:', error);
    }
  };

  const handleAssignOrder = async (partnerId) => {
    try {
      await axiosInstance.patch('/api/orders/assign', {
        orderId: selectedOrder._id,
        partnerId
      });
      toast.success('Order assigned successfully');
      setShowAssignModal(false);
      fetchOrders();
      fetchOrders();
      fetchOrders();
      fetchOrders();
      fetchOrders();
    } catch (error) {
      toast.error('Failed to assign order');
      console.error('Error assigning order:', error);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/api/orders/status/${orderId}`, { status });
      toast.success('Status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error updating status:', error);
    }
  };

  const handleAutoAssign = async () => {
    setAutoAssignLoading(true);
    try {
      const response = await axiosInstance.post('/api/orders/auto-assign');
      toast.success(`Assigned ${response.data.count} orders automatically`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to auto-assign orders');
      console.error('Error auto-assigning orders:', error);
    } finally {
      setAutoAssignLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const response = await axiosInstance.get(`/api/orders/report?range=${reportRange}`);
      setReportData(response.data);
      setShowReportModal(true);
    } catch (error) {
      toast.error('Failed to generate report');
      console.error('Error generating report:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    return (
      (filters.status === '' || order.status === filters.status) &&
      (filters.partner === '' || order.assignedTo?._id === filters.partner)
    );
  });

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <FiPackage className="text-indigo-600 mr-3 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAutoAssign}
              disabled={autoAssignLoading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
            >
              {autoAssignLoading ? (
                <FiRefreshCw className="animate-spin mr-2" />
              ) : (
                <FiPlus className="mr-2" />
              )}
              Auto Assign
            </button>
            <button
              onClick={generateReport}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiBarChart2 className="mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
              <select
                value={filters.partner}
                onChange={(e) => setFilters({ ...filters, partner: e.target.value })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Partners</option>
                {partners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', partner: '' })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerContact}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1 text-gray-500" />
                          {order.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.assignedTo ? (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FiUser className="text-blue-600 text-xs" />
                            </div>
                            {console.log(order)}
                            <div className="ml-2">{order.assignedTo.name}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {order.status !== 'Completed' && (
                            <>
                              {!order.assignedTo && (
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowAssignModal(true);
                                  }}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-sm flex items-center hover:bg-indigo-100 transition-colors"
                                >
                                  Assign
                                </button>
                              )}
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="px-2 py-1 bg-gray-50 border text-black border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetailsModal(true);
                            }}
                            className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-sm flex items-center hover:bg-gray-100 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No orders found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assign Order Modal */}
      <AnimatePresence>
        {showAssignModal && selectedOrder && (
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
              <div className="bg-indigo-600 p-5">
                <h2 className="text-xl font-bold text-white">
                  Assign Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-indigo-100 mt-1">
                  Customer: {selectedOrder.customerName}
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Pickup Partner
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {partners.map((partner) => (
                        <div
                          key={partner._id}
                          onClick={() => handleAssignOrder(partner._id)}
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer flex items-center"
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{partner.name}</div>
                            <div className="text-sm text-gray-500">
                              {partner.assignedOrders?.length || 0} active orders
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.location && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Order Location</h3>
                      <div className="h-48 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4">
                          <FiMapPin className="mx-auto text-2xl text-gray-400 mb-2" />
                          <p className="text-gray-500">
                            Latitude: {selectedOrder.location.latitude}<br />
                            Longitude: {selectedOrder.location.longitude}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
<AnimatePresence>
  {showOrderDetailsModal && selectedOrder && (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="bg-indigo-600 p-4 md:p-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Order #{selectedOrder._id.slice(-6).toUpperCase()}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Status: <span className={`px-2 py-0.5 rounded-full ${statusColors[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowOrderDetailsModal(false)}
            className="text-indigo-100 hover:text-white p-1"
          >
            <FiX size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="p-4 md:p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Customer Information */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-md md:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiUser className="text-gray-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">{selectedOrder.customerName}</p>
                    <p className="text-xs md:text-sm text-gray-500">Customer Name</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiPhone className="text-gray-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">{selectedOrder.customerContact}</p>
                    <p className="text-xs md:text-sm text-gray-500">Contact Number</p>
                  </div>
                </div>
                {selectedOrder.location && (
                  <div className="flex items-start">
                    <FiMapPin className="text-gray-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-900">
                        {selectedOrder.location.address || 'No specific address'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        Coordinates: {selectedOrder.location.latitude}, {selectedOrder.location.longitude}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Information */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-md md:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                Order Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiDollarSign className="text-gray-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">${selectedOrder.amount}</p>
                    <p className="text-xs md:text-sm text-gray-500">Order Amount</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiClock className="text-gray-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">Order Date</p>
                  </div>
                </div>
                {selectedOrder.assignedTo && (
                  <div className="flex items-start">
                    <FiUser className="text-gray-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm md:text-base font-medium text-gray-900">{selectedOrder.assignedTo.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">Assigned Partner</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {selectedOrder.notes && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
              <h3 className="text-md md:text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
              <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                <p className="text-gray-700 text-sm md:text-base">{selectedOrder.notes}</p>
              </div>
            </div>
          )}

          {/* Location Map Preview */}
          {selectedOrder.location && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
              <h3 className="text-md md:text-lg font-medium text-gray-900 mb-2">Location</h3>
              <div className="h-40 md:h-48 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-center p-3 md:p-4">
                  <FiMapPin className="mx-auto text-xl md:text-2xl text-gray-400 mb-1 md:mb-2" />
                  <p className="text-gray-500 text-xs md:text-sm">
                    Latitude: {selectedOrder.location.latitude}<br />
                    Longitude: {selectedOrder.location.longitude}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 md:px-6 py-3 flex justify-end gap-3 border-t border-gray-200 sticky bottom-0">
          <button
            onClick={() => setShowOrderDetailsModal(false)}
            className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
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
              <div className="bg-indigo-600 p-5">
                <h2 className="text-xl font-bold text-white">
                  Order Report
                </h2>
                <div className="flex items-center mt-2">
                  <select
                    value={reportRange}
                    onChange={(e) => setReportRange(e.target.value)}
                    className="bg-indigo-500 text-white border-none rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <button
                    onClick={generateReport}
                    className="ml-2 p-1 bg-indigo-400 rounded-md hover:bg-indigo-300"
                  >
                    <FiRefreshCw className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {reportData.map((item) => (
                    <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="font-medium text-gray-700">{item._id}</span>
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold shadow-sm">
                        {item.count} orders
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;