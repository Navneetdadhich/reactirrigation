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
  const hours = parseInt(time.substring(0, 2));
  const mins = parseInt(time.substring(2, 4));
  const secs = parseInt(time.substring(4));
  
  let totalMins = mins + minutes;
  let newHours = hours + Math.floor(totalMins / 60);
  let newMins = totalMins % 60;
  let newSecs = secs;
  
  if (newHours >= 24) {
    newHours = newHours % 24;
  }
  
  return `${String(newHours).padStart(2, '0')}${String(newMins).padStart(2, '0')}${String(newSecs).padStart(2, '0')}`;
};


const generateSchedule = () => {
  if (!numPlots || !numMotors || !startTime || !endTime || !motorRuntime || !cycleInterval) {
    alert('Please fill all fields');
    return;
  }

  const plots = Array.from({length: numPlots}, (_, i) => `D${i + 1}`);
  const motors = Array.from({length: numMotors}, (_, i) => `M${i + 1}`);
  
  let currentTime = startTime;
  const schedule = [];
  let motorIndex = 0;
  let plotIndex = 0;

  while (currentTime <= endTime) {
    // Assign motors to plots in sequence
    for (let i = 0; i < plots.length; i++) {
      const motor = motors[motorIndex % motors.length];
      const cycleEndTime = addMinutes(currentTime, motorRuntime);
      
      if (cycleEndTime <= endTime) {
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
    }
  }

  setDatasets(schedule);
};


const getStatus = (startTime, endTime) => {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  // const currentSeconds = currentTime.getSeconds();
  
  const start = new Date();
  start.setHours(parseInt(startTime.substring(0, 2)));
  start.setMinutes(parseInt(startTime.substring(2, 4)));
  start.setSeconds(parseInt(startTime.substring(4)));
  
  const end = new Date();
  end.setHours(parseInt(endTime.substring(0, 2)));
  end.setMinutes(parseInt(endTime.substring(2, 4)));
  end.setSeconds(parseInt(endTime.substring(4)));
  
  if (currentHours < start.getHours() || (currentHours === start.getHours() && currentMinutes < start.getMinutes())) {
    return 'Pending';
  } else if (currentHours > end.getHours() || (currentHours === end.getHours() && currentMinutes > end.getMinutes())) {
    return 'Done';
  } else {
    return 'In Progress';
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
