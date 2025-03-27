import { useState, useEffect } from 'react';
import './index.css';

const datasets = [
  {
    index: 0,
    plot: 'D1',
    startTime: '070000',
    endTime: '070459',
    RunBy: 'M1'
  },
  {
    index: 1,
    plot: 'D2',
    startTime: '070000',
    endTime: '070459',
    RunBy: 'M2'
  },
  {
    index: 2,
    plot: 'D3',
    startTime: '070500',
    endTime: '070959',
    RunBy: 'M1'
  },
  {
    index: 3,
    plot: 'D4',
    startTime: '070500',
    endTime: '070959',
    RunBy: 'M2'
  },
  {
    index: 4,
    plot: 'D1',
    startTime: '073000',
    endTime: '073459',
    RunBy: 'M1'
  },
  {
    index: 5,
    plot: 'D2',
    startTime: '073000',
    endTime: '073459',
    RunBy: 'M2'
  },
  {
    index: 6,
    plot: 'D3',
    startTime: '073500',
    endTime: '073959',
    RunBy: 'M1'
  },
  {
    index: 7,
    plot: 'D4',
    startTime: '073500',
    endTime: '073959',
    RunBy: 'M2'
  },
  {
    index: 8,
    plot: 'D4',
    startTime: '143500',
    endTime: '143959',
    RunBy: 'M2'
  },
  {
    index: 9,
    plot: 'D4',
    startTime: '143500',
    endTime: '143959',
    RunBy: 'M2'
  },
  {
    index: 10,
    plot: 'D4',
    startTime: '183500',
    endTime: '183959',
    RunBy: 'M2'
  },
  {
    index: 11,
    plot: 'D4',
    startTime: '143500',
    endTime: '143959',
    RunBy: 'M2'
  },
  {
    index: 12,
    plot: 'D4',
    startTime: '223500',
    endTime: '223959',
    RunBy: 'M2'
  },
]

function militaryToNormalTime(militaryTime) {
  const hours = parseInt(militaryTime.substring(0, 2));
  const minutes = militaryTime.substring(2, 4);
  const seconds = militaryTime.substring(4);
  const period = hours >= 12 ? 'PM' : 'AM';
  const normalHours = hours % 12 || 12;
  return `${normalHours}:${minutes}:${seconds} ${period}`;
}

function App() {

  const [plot, setPlot] = useState('');
const [runBy, setRunBy] = useState('');
const [datasets, setDatasets] = useState([
  {
    index: 0,
    plot: 'D1',
    startTime: '070000',
    endTime: '070459',
    RunBy: 'M1'
  },
]);


const [numPlots, setNumPlots] = useState(0);
const [numMotors, setNumMotors] = useState(0);
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [motorRuntime, setMotorRuntime] = useState(0);
const [cycleInterval, setCycleInterval] = useState(0);
const [selectedPlot, setSelectedPlot] = useState('All');
const [selectedStatus, setSelectedStatus] = useState('All');


const addMinutes = (time, minutes) => {
  // Ensure proper parsing of time components
  const hours = parseInt(time.substring(0, 2), 10);
  const mins = parseInt(time.substring(2, 4), 10);
  const secs = parseInt(time.substring(4), 10);
  
  if (isNaN(hours) || isNaN(mins) || isNaN(secs)) {
    console.error('Invalid time format:', time);
    return time; // Return original if invalid
  }
  
  let totalMins = mins + parseInt(minutes, 10);
  let newHours = hours + Math.floor(totalMins / 60);
  let newMins = totalMins % 60;
  
  // Handle 24-hour rollover
  if (newHours >= 24) {
    newHours = newHours % 24;
  }
  
  return `${String(newHours).padStart(2, '0')}${String(newMins).padStart(2, '0')}${String(secs).padStart(2, '0')}`;
};


const generateSchedule = () => {
  // Check for empty fields
  if (!numPlots || !numMotors || !startTime || !endTime || !motorRuntime || !cycleInterval) {
    alert('Please fill all fields');
    return;
  }
  
  // Validate numeric inputs
  if (numPlots <= 0 || numMotors <= 0 || motorRuntime <= 0 || cycleInterval < 0) {
    alert('Please enter positive values for plots, motors, and times');
    return;
  }
  
  // Limit excessive inputs
  if (numPlots > 100) {
    alert('Maximum 100 plots allowed for performance reasons');
    return;
  }
  
  // Format time inputs if they're not in HHMMSS format
  const formatTime = (time) => {
    // Remove non-numeric characters
    const cleanTime = time.replace(/[^0-9]/g, '');
    
    if (cleanTime.length === 1) return `0${cleanTime}0000`;
    if (cleanTime.length === 2) return `${cleanTime}0000`;
    if (cleanTime.length === 3) return `0${cleanTime.substring(0, 1)}${cleanTime.substring(1)}00`;
    if (cleanTime.length === 4) return `${cleanTime}00`;
    if (cleanTime.length === 5) return `0${cleanTime}`;
    return cleanTime.substring(0, 6).padEnd(6, '0');
  };

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  
  // Validate time values
  if (parseInt(formattedStartTime) > parseInt(formattedEndTime)) {
    alert('End time must be after start time');
    return;
  }

  const plots = Array.from({length: numPlots}, (_, i) => `D${i + 1}`);
  const motors = Array.from({length: numMotors}, (_, i) => `M${i + 1}`);
  
  let currentTime = formattedStartTime;
  const schedule = [];
  let motorIndex = 0;
  
  // Prevent infinite loops with maximum iterations
  const maxIterations = 1000;
  let iterations = 0;

  while (currentTime <= formattedEndTime && iterations < maxIterations) {
    iterations++;
    
    for (let i = 0; i < plots.length; i++) {
      const motor = motors[motorIndex % motors.length];
      const cycleEndTime = addMinutes(currentTime, motorRuntime);
      
      if (cycleEndTime <= formattedEndTime) {
        schedule.push({
          index: schedule.length,
          plot: plots[i],
          startTime: currentTime,
          endTime: cycleEndTime,
          RunBy: motor
        });
      }

      motorIndex++;
      
      currentTime = addMinutes(currentTime, motorRuntime + cycleInterval);
      
      // Break if we've exceeded the end time
      if (currentTime > formattedEndTime) {
        break;
      }
    }
  }
  
  if (schedule.length === 0) {
    alert('No valid schedule could be created with these parameters');
    return;
  }

  setDatasets(schedule);
};


const getStatus = (startTime, endTime) => {
  try {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    
    // Safely parse time values
    const startHours = parseInt(startTime.substring(0, 2), 10) || 0;
    const startMinutes = parseInt(startTime.substring(2, 4), 10) || 0;
    
    const endHours = parseInt(endTime.substring(0, 2), 10) || 0;
    const endMinutes = parseInt(endTime.substring(2, 4), 10) || 0;
    
    // Create comparable time values (minutes since midnight)
    const currentTimeValue = currentHours * 60 + currentMinutes;
    const startTimeValue = startHours * 60 + startMinutes;
    const endTimeValue = endHours * 60 + endMinutes;
    
    // Handle overnight schedules
    if (endTimeValue < startTimeValue) {
      // Schedule crosses midnight
      if (currentTimeValue >= startTimeValue || currentTimeValue <= endTimeValue) {
        return 'In Progress';
      } else {
        return 'Pending';
      }
    }
    
    // Normal same-day schedule
    if (currentTimeValue < startTimeValue) {
      return 'Pending';
    } else if (currentTimeValue > endTimeValue) {
      return 'Done';
    } else {
      return 'In Progress';
    }
  } catch (error) {
    console.error('Error determining status:', error);
    return 'Unknown';
  }
};


const filteredDatasets = datasets.filter(item => {
  const plotMatch = selectedPlot === 'All' || item.plot === selectedPlot;
  
  const status = getStatus(item.startTime, item.endTime);
  const statusMatch = selectedStatus === 'All' || status === selectedStatus;
  
  return plotMatch && statusMatch;
});


useEffect(() => {
  const interval = setInterval(() => {
    setDatasets(prev => prev.map(item => ({
      ...item,
      status: getStatus(item.startTime, item.endTime)
    })))
  }, 60000);
  
  return () => clearInterval(interval);
}, []);

  const CurrentHours = new Date().getHours();
  const CurrentMinutes = new Date().getMinutes();
  const CurrentSeconds = new Date().getSeconds();
  // console.log(CurrentHours, CurrentMinutes, CurrentSeconds);


  return (
    <>
      <h1 className='text-4xl font-bold text-gray-600 text-center pt-5'>Irrigation Scheduler </h1>

    <div className="filters p-5 bg-gray-600/10  my-5 text-center mx-30 flex flex-row gap-5 flex-wrap items-center rounded-lg border border-gray-400 wrap">
  <label>Filter by Plot:</label>
  <select value={selectedPlot} onChange={(e) => setSelectedPlot(e.target.value)}>
    <option value="All">All Plots</option>
    {[...new Set(datasets.map(item => item.plot))].map(plot => (
      <option key={plot} value={plot}>{plot}</option>
    ))}
  </select>

  <label>Filter by Status:</label>
  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
    <option value="All">All Statuses</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Done">Done</option>
  </select>
</div>
    <div className='p-5 bg-gray-600/10 w-200px h-[200px] my-5 text-center mx-30 flex flex-row gap-5 flex-wrap justify-between items-center rounded-lg border border-gray-400 wrap'>


    <div className='flex flex-col gap-2'>

      <label>Number of Plots:</label>
      <input type="number" value={numPlots} onChange={(e) => setNumPlots(e.target.value)} />
    </div>
    <div className='flex flex-col gap-2'> 
      <label>Number of Motors:</label>
      <input type="number" value={numMotors} onChange={(e) => setNumMotors(e.target.value)} />
    </div>
    <div className='flex flex-col gap-2'>
      <label>Start Time (HHMMSS):</label>
      <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
    </div>
    <div className='flex flex-col gap-2'>
      <label>End Time (HHMMSS):</label>
      <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
    </div>
    
    <div className='flex flex-col gap-2'>
      <label>Motor Runtime (minutes):</label>
      <input type="number" value={motorRuntime} onChange={(e) => setMotorRuntime(e.target.value)} />
    </div>
    <div className='flex flex-col gap-2'>
      <label>Cycle Interval (minutes):</label>
      <input type="number" value={cycleInterval} onChange={(e) => setCycleInterval(e.target.value)} />
    </div>
    <div className='flex flex-col gap-2'>
      <button onClick={generateSchedule} className='bg-green-600/10 text-green-800 font-bold py-2 px-4 rounded cursor-pointer hover:bg-green-600/20' >Generate Schedule</button>
    </div>
    </div>

      <div className=' px-30'>
        <div className='relative overflow-x-auto shadow-lg rounded-lg border border-gray-400 px-4 mt-10 p-5 bg-gray-600/10'>
          <table className='w-full text-sm text-left rt1:text-right bg-glass overflow-hidden border border-gray-500 text-gray-600'>
            <thead className='uppercase'>
              <tr>
                <th scope='col' className='p-4'>
                  <div className='flex items-center'>index</div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='flex items-center'>plot</div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='flex items-center'>start-Time</div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='flex items-center'>end-Time</div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='flex items-center'>Runby</div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='flex items-center'>Status</div>
                </th>
              </tr>
            </thead>

            <tbody className=''>
              {filteredDatasets.map((user, idx) => (
                <tr className='bg-glass border-b rounded-lg text-gray-600' key={user.index}>
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <span>{idx + 1}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>{user.plot}</td>
                  <td className='px-6 py-4'>{militaryToNormalTime(user.startTime)}</td>
                  <td className='px-6 py-4'>{militaryToNormalTime(user.endTime)}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>

                      {user.RunBy}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                  <div className='flex items-center'>
    {getStatus(user.startTime, user.endTime) === 'In Progress' ? (
      <div className='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded border border-blue-500'>In Progress</div>
    ) : getStatus(user.startTime, user.endTime) === 'Done' ? (
      <div className='text-green-500 font-bold bg-green-100 px-2 py-1 rounded border border-green-500'>Done</div>
    ) : (
      <div className='text-red-500 font-bold bg-red-100 px-2 py-1 rounded border border-red-500'>Pending</div>
    )}
  </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </>
  )
}



export default App
