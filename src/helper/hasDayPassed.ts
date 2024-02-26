import {storage} from '../..';

export const hasDayPassed = () => {
  const storedTime = new Date(storage.getString('@startTime') ?? '');
  console.log('stored', storage.getString('@startTime'));
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - storedTime.getTime(); // difference in milliseconds

  const timeDifferenceInMinutes = timeDifference / 1000 / 60; // convert to minutes

  return timeDifferenceInMinutes >= 1440;
};
