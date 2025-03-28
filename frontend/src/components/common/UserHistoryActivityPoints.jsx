import { pointsAPI } from '../../api/apiService'; 
import { useState, useEffect } from 'react';
export default function UserHistoryActivityPoints({ user_id }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        const fetchHistory = async () => {

            try {
                const response = await pointsAPI.getUserTransactions(user_id, {
                  page, perPage
                });
                console.log(response);
                setHistory(response.transactions);
                setTotalPages(response.pagination.totalPages);
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching history:', error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user_id, page, perPage]);

    return (
        <div className="points-history-container">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Points History</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing page {page} of {totalPages}
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    This is a record of all point transactions for this user, including points earned and spent.
                </p>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No points history available</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                                        <td className="px-4 py-3 text-sm">{item.note}</td>
                                        <td className={`px-4 py-3 text-sm font-medium ${item.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.type === 'add' ? '+' : '-'}{item.points}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.type === 'add' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.type === 'add' ? 'Earned' : 'Spent'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <button 
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 border rounded-md ${
                                    page === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                Previous
                            </button>
                            
                            <span className="text-sm text-gray-700">
                                Page {page} of {Math.ceil(totalPages / perPage)}
                            </span>
                            
                            <button 
                                onClick={() => setPage(prev => prev + 1)}
                                disabled={page >= Math.ceil(totalPages / perPage)}
                                className={`px-4 py-2 border rounded-md ${
                                    page >= Math.ceil(totalPages / perPage)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}