import './App.css';

import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

import Search from './Components/Search';
import AddAppointment from './Components/AddAppointment';
import AppointmentInfo from './Components/AppointmentInfo';


import { BiCalendar } from 'react-icons/bi'



function App() {

  const [appointmentList, setappointmentList] = useState([]);
  const fetchData = useCallback(() => {
      fetch('./Data.json')
      .then(response => response.json())
      .then(data =>{
        setappointmentList(data)
      });
    },[])

    useEffect(()=>{
      fetchData()
    },[fetchData]);
  
    const [query, setquery] = useState("");
    let [sortBy, setSortBy] = useState("ownerName");
    let [orderBy, setOrderBy] = useState("asc");
    const filteredAppointments = appointmentList.filter(
      item =>{
        return(
          item.petName.toLowerCase().includes(query.toLowerCase()) ||
          item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
          item.aptNotes.toLowerCase().includes(query.toLowerCase())
          )
      }
    ).sort((a, b) => {
      let order = (orderBy === 'asc') ? 1 : -1;
      return (
        a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
          ? -1 * order : 1 * order
      )
    })
   

  return (
    <div className="App">
      <div className="App container mx-auto mt-3 font-thin">
        <h1 className="text-5xl mb-3">
          <BiCalendar className="inline-block text-yellow-400 align-top" />
          Your Repos
        </h1>
        <AddAppointment onSendAppointment={myAppointment => setappointmentList([...appointmentList, myAppointment])}
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
        />
        <Search query={query} onQueryChange={myQuery => setquery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={mySort => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}
        />
        <ul className="divide-y divide-gray-200">
        {filteredAppointments
          .map(appointment => (
            <AppointmentInfo 
                  key={appointment.id} 
                  appointment={appointment}
                  onDeleteAppointment={
                    appointmentId => 
                    setappointmentList(appointmentList.filter(appointment =>
                      appointment.id !== appointmentId))
                  }

                 
             />
          ))
        }
      </ul>
      </div>
    </div>
  );
}

export default App;
