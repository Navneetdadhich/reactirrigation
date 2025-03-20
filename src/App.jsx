import { useState } from 'react';
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

  const CurrentHours = new Date().getHours();
  const CurrentMinutes = new Date().getMinutes();
  const CurrentSeconds = new Date().getSeconds();
  console.log(CurrentHours, CurrentMinutes, CurrentSeconds);


  return (
    <>
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
              {datasets.map((user, idx) => (
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
                      {CurrentHours <= parseInt(user.endTime.substring(0, 2)) && CurrentHours >= parseInt(user.startTime.substring(0, 2)) ? (
                        <div className='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded border border-blue-500'>In Progress</div>
                      ) : (
                        <div>{CurrentHours > parseInt(user.endTime.substring(0, 2)) ? <p className='text-green-500 font-bold bg-green-100 px-2 py-1 rounded border border-green-500'>Done</p> : <p className='text-red-500 font-bold bg-red-100 px-2 py-1 rounded border border-red-500'>Pending</p>}</div>
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
