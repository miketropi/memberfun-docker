import React, { useState, useEffect, useRef } from 'react';
import Toast from '../Toast';
import { Diamond } from 'lucide-react';
import useUserStore from '../../store/userStore';
import { pointsAPI } from '../../api/apiService';

const RandomNumberRoller = ({ min = 1, max = 100, speed = 100, className = "" }) => {
  const [number, setNumber] = React.useState(Math.floor(Math.random() * (max - min + 1)) + min);
  const [isRolling, setIsRolling] = React.useState(true);
  const [finalNumber, setFinalNumber] = React.useState(null);
  const intervalRef = React.useRef(null);

  React.useEffect(() => {
    if (isRolling) {
      intervalRef.current = setInterval(() => {
        setNumber(Math.floor(Math.random() * (max - min + 1)) + min);
      }, speed);
    } else if (finalNumber !== null) {
      clearInterval(intervalRef.current);
      setNumber(finalNumber);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRolling, finalNumber, min, max, speed]);

  return (
    <div className={`${isRolling ? 'animate-pulse' : ''} ${className}`}>
      {number}
    </div>
  );
};

const ClaimPointsDaily = ( { lastClaimDate = null, serverCurrentDate = null, updatedUserPoints } ) => {
  const { userData } = useUserStore();
  const [canClaim, setCanClaim] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState(0);
  const toastRef = useRef();

  useEffect(() => {
    // validate lastClaimDate
    // if (!lastClaimDate) {
    //   // set lastClaimDate to today
    //   lastClaimDate = new Date().toISOString().split('T')[0];
    // }

    // Check if user has claimed today
    // today is in format YYYY-MM-DD

    if(!serverCurrentDate) {
      setCanClaim(false);
      return;
    }

    const today = serverCurrentDate.split(' ')[0];

    // lastClaimDate is in format 2025-03-30 08:54:56 convert to YYYY-MM-DD
    const lastClaim = lastClaimDate ? lastClaimDate.split(' ')[0] : null;

    if (lastClaim === today) {
      console.log('can\'t claim');
      setCanClaim(false);
    } else {
      console.log('can claim');
      setCanClaim(true);
    }
  }, [lastClaimDate]);

  const handleClaim = async () => {
    try {
      setIsLoading(true);
      
      // Call API to claim points
      const response = await pointsAPI.claimDailyPoints(userData.id);
      console.log(response);
      if (response.success) {
        // Update last claim date
        // localStorage.setItem('lastClaimDate', response.last_claim_date);
        // setLastClaimDate(response.last_claim_date);
        setCanClaim(false);
        setNumber(response.claim_points);
        // Update user points in store
        // validate updatedUserPoints
        if (typeof updatedUserPoints === 'function') {
          updatedUserPoints(response.user_points);
        }

        // Show success message with claimed points
        toastRef.current.show(`Successfully claimed ${response.claim_points} points!`, {
          type: 'success',
          duration: 3000,
          position: 'top-right'
        });
      } else {
        throw new Error('Failed to claim points');
      }
    } catch (error) {
      toastRef.current.show('Failed to claim points. Please try again.', {
        type: 'error',
        duration: 3000,
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextClaimTime = () => {
    // console.log(lastClaimDate, serverCurrentDate);
    if (!lastClaimDate) return null;
    
    const lastClaim = new Date(lastClaimDate);
    const tomorrow = new Date(lastClaim);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // now from serverCurrentDate and format to YYYY-MM-DD
    const now = new Date(serverCurrentDate);
    const timeLeft = tomorrow - now;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Toast ref={toastRef} />
      {/* { lastClaimDate } */}
      
      {/* { button test claim points } */}
      {/* <button onClick={handleClaim}>Test Claim Points</button> */}
      {/* <RandomNumberRoller onPick={ (refFn) => {
        console.log(refFn);
        setTimeout(() => {
          refFn._setIsRolling(false);
          refFn._setFinalNumber(5);
        }, 3000);
      } } /> */}
      {/* { lastClaimDate } - { serverCurrentDate } */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
            Daily Points Reward
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            🎁 Login every day to claim your random points bonus! ✨
            🏆 Become a host for a <strong>Seminar</strong> or join <strong>Challenges</strong> to get more points! 🚀
          </p>
          <div className="mt-3 md:mt-4 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs md:text-sm text-green-600 font-medium">
              {canClaim ? 'Available to claim now' : `Next claim in: ${getNextClaimTime()}`}
            </span>
          </div>
        </div>
        
        <div className="p-4 md:p-6 flex flex-col justify-center items-center bg-white">
          {canClaim ? (
            <>
              <div className="text-center mb-3 md:mb-4">
                <div className="inline-block p-2 md:p-3 rounded-full bg-blue-100 mb-2">
                  <Diamond className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                <p className="text-sm md:text-base text-gray-700 font-medium">Ready to claim your daily points?</p>
              </div>
              <button
                className={`w-full py-2 md:py-3 px-4 md:px-6 text-white bg-blue-600 rounded-lg 
                  transition-all duration-200 ease-in-out text-sm md:text-base
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md'}
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  relative`}
                onClick={handleClaim}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...(+<RandomNumberRoller className="font-bold mr-1" /> points)
                  </span>
                ) : (
                  'Claim Your Daily Points'
                )}
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-block p-2 md:p-3 rounded-full bg-gray-100 mb-3 md:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">
                Points Already Claimed
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-2">
                {
                  number > 0 
                    ? `You've claimed +${number} points today!` 
                    : "You've already claimed your daily points!"
                }
              </p>
              <p className="text-sm md:text-base text-blue-600 font-medium">
                Come back in {getNextClaimTime()}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClaimPointsDaily;
