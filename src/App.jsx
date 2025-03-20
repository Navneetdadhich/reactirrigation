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
]

function App() {
  
  return (
    <>
    <div className=' px-30'>

  
   
      <div className='relative overflow-x-auto shadow-lg rounded-lg border border-gray-400 px-4 mt-10 p-5 bg-gray-600/10'>
      <table className='w-full text-sm text-left rt1:text-right bg-glass overflow-hidden border border-gray-500 text-gray-600'>
        <thead>
          <tr>
            <th scope='col' className='p-4'>
              <div className='flex items-center'>index</div>
            </th>
            <th scope='col' className='px-6 py-3'>
              <div className='flex items-center'>plot</div>
            </th>
            <th scope='col' className='px-6 py-3'>
              <div className='flex items-center'>startTime</div>
            </th>
            <th scope='col' className='px-6 py-3'>
              <div className='flex items-center'>endTime</div>
            </th>
            <th scope='col' className='px-6 py-3'>
              <div className='flex items-center'>Runby</div>
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
							<td className='px-6 py-4'>{user.startTime}</td>
							<td className='px-6 py-4'>{user.endTime}</td>
							<td className='px-6 py-4'>
								<div className='flex items-center'>
									
								{user.RunBy}
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
