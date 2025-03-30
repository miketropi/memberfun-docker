import { useEffect, useState } from 'react';
import { pointsAPI } from '../../api/apiService';
import UserRank from '../UserRank';
import Modal from '../Modal';
import UserHistoryActivityPoints from '../common/UserHistoryActivityPoints';
import Pagination from '../common/Pagination';

/**
 * Leaderboard Tab
 * @returns {JSX.Element}
 * 
 * leaderboard is a list of users with their points
 *  - rank
 *  - user_id
 *  - total
 *  - user_info
 *    - id
 *    - name
 *    - email
 *    - avatar
 * 
 * pagination is the total number of pages
 * page is the current page
 * perPage is the number of items per page
 */

export default function LeaderboardTab() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await pointsAPI.getLeaderboard({
                    page,
                    per_page: perPage,
                });
                console.log(response);
                setLeaderboard(response.leaderboard);
                setTotalPages(response.pagination.total_pages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [page, perPage]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No leaderboard data available.</p>
            </div>
        );
    }

    return (
        <>
          <div className="p-6">
              <h1 className="text-2xl font-bold mb-6 dark:text-white">Leaderboard</h1>
              
              <div className="overflow-x-auto border">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Rank
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  User
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Points
                              </th>
                              {/** history activity */}
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  History
                              </th>
                          </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {leaderboard.map((entry) => (
                              <tr key={entry.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <UserRank rank={entry.rank} />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                          <div className="h-10 w-10 flex-shrink-0">
                                              <img
                                                  className="h-10 w-10 rounded-full"
                                                  src={entry.user_info.avatar || 'default-avatar.png'}
                                                  alt=""
                                              />
                                          </div>
                                          <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.user_info.name}</div>
                                              <div className="text-sm text-gray-500 dark:text-gray-400">{entry.user_info.email}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{entry.total} pts</div>
                                  </td>
                                  {/** history activity */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                          <button 
                                            className="text-blue-500 hover:text-blue-700" 
                                            onClick={() => {
                                                setSelectedUser(entry.user_id);
                                                setIsModalOpen(true);
                                            }}>View</button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </div>
              )}
              {/* <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-2">
                      <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                          Previous
                      </button>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                          Page {page} of {totalPages}
                      </span>
                      <button
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
                          className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                          Next
                      </button>
                  </nav>
              </div> */}

          </div>
          <Modal 
            isOpen={isModalOpen} 
            size="xl"
            onClose={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}
            title={ `History Activity of ${leaderboard?.find(user => user.user_id === selectedUser)?.user_info?.name || 'User'}` }
          >
            {
              selectedUser && (
                <UserHistoryActivityPoints user_id={selectedUser} />
              )
            }
          </Modal>
        </>
    );
}